from django.conf import settings
from django.core.cache import cache
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError
from django.db.models import Count
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from .models import *
from .utils import Utils
from .serializers import *
import random, jwt
from operator import attrgetter
from urllib.parse import urlparse


class MyPageNumberPagination(PageNumberPagination):
    page_size = 5
    max_page_size = 5
    
    def get_next_link(self):
        if not self.page.has_next():
            return None
        url = super().get_next_link()
        return self._strip_urlhost(url)
    
    def get_previous_link(self):
        if not self.page.has_previous():
            return None
        url = super().get_previous_link()
        return self._strip_urlhost(url)
    
    def _strip_urlhost(self, url):
        parsed = urlparse(url)
        return parsed.path + ('?' + parsed.query if parsed.query else '')
    
    def get_paginated_response(self, data):
        return Response({
            'current_page': self.page.number,
            'total_pages': self.page.paginator.num_pages,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data,
        })  


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    permission_classes = [AllowAny]

class UserCreateApiView(generics.CreateAPIView):
    queryset = CustomUser
    serializer_class = CustomUserWriteSerializer
    permission_classes = [AllowAny]
    raise_exception = True


class PasswordResetAPIView(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data.get('email')
        user = CustomUser.objects.get(email=email)
        token = RefreshToken.for_user(user).access_token
        redirect_link = 'http://localhost:5173/reset-password/new-password?token=' + str(token)
        email_data = {
            'subject': 'Password Reset',
            'body': f'Follow the link to reset your password \n {redirect_link}',
            'to': email,
        }
        Utils.send_email(email_data)
        return Response({'message': 'Password reset link has been sent to your email'}, status=status.HTTP_200_OK)
    

class PasswordResetConfirmAPIView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data.get('token')
        password = serializer.validated_data.get('password')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user = CustomUser.objects.get(id=payload['user_id'])
            user.set_password(password)
            user.save()
            return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
        
        except jwt.ExpiredSignatureError as e:
            return Response({'error': 'Token has expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError as e:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist as e:
            return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'An error occurred'}, status=status.HTTP_400_BAD_REQUEST)


class EmailVerificationAPIView(generics.GenericAPIView):
    serializer_class = EmailVerificationSerializer
    
    
    def post(self, request):
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data.get('email')
        mode = serializer.validated_data.get('mode')
        user = CustomUser.objects.get(email=email)
        
        if mode == 'send':
            if cache.get(f"otp_{email}"):
                return Response({'error': 'An OTP has already been sent to your email'}, status=status.HTTP_400_BAD_REQUEST)
            elif user.is_email_verified:
                return Response({'error':'Email has already been verified'}, status=status.HTTP_400_BAD_REQUEST)
            
            otp = random.randint(100000, 999999)
            subject = "Email Verification"
            cache.set(f"otp_{email}", otp, timeout=300)
            body = f"Copy and enter the code below to verify your email \n {str(otp)} \n the code expires in 5 minutes!"
            data = {
                'subject': subject,
                'body': body,
                'to': email
            }
            Utils.send_email(data)
            return Response({'message': 'OTP code has been sent to your email'}, status=status.HTTP_200_OK)
            
        elif mode == 'resend':
            if user.is_email_verified:
                return Response({'error':'Email has already been verified'}, status=status.HTTP_400_BAD_REQUEST)
            
            otp = random.randint(100000, 999999)
            subject = "Email Verification"
            cache.set(f"otp_{email}", otp, timeout=300)
            body = f"Copy and enter the code below to verify your email \n {str(otp)} \n the code expires in 5 minutes!"
            data = {
                'subject': subject,
                'body': body,
                'to': email
            }
            Utils.send_email(data)
            return Response({'message': 'OTP code has been sent to your email'}, status=status.HTTP_200_OK)
    
    
class OTPVerificationAPIView(generics.GenericAPIView):
    serializer_class = OTPVerificationSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data.get('email')
        user = CustomUser.objects.get(email=email)
        user.is_email_verified = True
        user.save()
        cache.delete(f"otp_{email}")
        return Response({'message': 'OTP verification successful'}, status=status.HTTP_200_OK)
    
    
class RestaurantListAPIView(generics.ListAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantListSerializer
    

class RestaurantAPIView(generics.GenericAPIView):
    serializer_class = RestaurantSerializer

    def get(self, request, uuid):
        try:
            restaurant = Restaurant.objects.get(uuid=uuid)
            serializer = self.get_serializer(restaurant)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Restaurant.DoesNotExist:
            return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)


class RestaurantDiscountsAPIView(generics.GenericAPIView):
    serializer_class = RestaurantDiscountSerializer
    
    def get(self, request, uuid):
        try:
            restaurant = Restaurant.objects.get(uuid=uuid)
            discounts = restaurant.discounts.all()
            serializer = self.get_serializer(discounts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Restaurant.DoesNotExist:
            return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)
        
        
        
class MenuItemModifierAPIView(generics.GenericAPIView):
    serializer_class = MenuItemModifierSerializer
    
    def get(self, request, uuid):
        try:
            restaurant = Restaurant.objects.get(uuid=uuid)
            modifiers = restaurant.menu_item_modifiers.all()
            serializer = self.get_serializer(modifiers, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Restaurant.DoesNotExist:
            return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)
        
        
class OrderCreateAPIView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderWriteSerializer
    

class OrderRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderReadSerializer
    lookup_field = 'uuid'
    
    
class OrderUpdateAPIView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderStatusUpdateSerializer
    lookup_field = 'uuid'
    
    
class UserOrdersAPIView(generics.ListAPIView):
    serializer_class = OrderListSerializer
    
    def get_queryset(self):
        try:
            user_uuid = self.kwargs['uuid']
            user = CustomUser.objects.get(uuid=user_uuid)
            return Order.objects.filter(user=user)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class UserInfoReadAPIView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserReadSerializer
    lookup_field = 'uuid'
    
    
class RestaurantReviewsAPIView(generics.ListAPIView):
    serializer_class = RestaurantReviewReadSerializer
    
    def get_queryset(self):
        try:
            restaurant_uuid = self.kwargs['uuid']
            restaurant = Restaurant.objects.get(uuid=restaurant_uuid)
            return Review.objects.filter(restaurant=restaurant)
        except Restaurant.DoesNotExist:
            return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class ReviewCreateAPIView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewWriteSerializer
    

class OwnerRestaurantsAPIView(generics.ListAPIView):
    serializer_class = OwnedRestaurantsListSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.groups.filter(name='restaurant owner').exists():
            return ValidationError("User is not a restaurant owner")
        else:
            return Restaurant.objects.filter(owner=user)
            
        
    def get(self, request, *args, **kwargs):
        compact = request.query_params.get('compact');
        
        if compact is None:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif compact == 'true':
            restaurants = Restaurant.objects.filter(owner=request.user)
            data = [
                {'restaurant': restaurant.name, 'uuid': restaurant.uuid} for restaurant in restaurants
            ]
            return Response(data, status=status.HTTP_200_OK)
    
    
class OwnerDashboardAPIView(APIView):
    
    def get(self, request):
        try:
            user = request.user
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if not user.groups.filter(name='restaurant owner').exists():
            return Response({'error': 'User is not a restaurant owner'}, status=status.HTTP_403_FORBIDDEN)
        
        orders_count_period = request.query_params.get("orders_count_period", "today")
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = now - timezone.timedelta(days=now.weekday())
        month_start = now.replace(day=1)
        
        if orders_count_period == "today":
            start = today_start
        elif orders_count_period == "week":
            start = week_start
        elif orders_count_period == "month":
            start = month_start
        elif orders_count_period == "all_time":
            start = None
            
        
        
        restaurants = Restaurant.objects.filter(owner=user)
        recent_orders = Order.objects.filter(restaurant__in=restaurants).order_by('-created_at')[:6]
        recent_reviews = Review.objects.filter(restaurant__in=restaurants).order_by('-created_at')[:5]
        orders = Order.objects.filter(restaurant__in=restaurants, order_status=Order.OrderStatus.DELIVERED)
        
        revenue = {
            'today': round(sum(order.discounted_price for order in orders.filter(created_at__gte=today_start))),
            'week': round(sum(order.discounted_price for order in orders.filter(created_at__gte=week_start))),
            'month': round(sum(order.discounted_price for order in orders.filter(created_at__gte=month_start))),
           'all_time': round(sum(order.discounted_price for order in orders.all()))
        }
        if not start:
            orders_count = orders.all().count()
        else: 
            orders_count = orders.filter(created_at__gte=start).count()
        
        revenue_orders_serializer = OwnerTotalRevenueAndOrdersSerializer(instance={"revenue": revenue, "orders": orders_count}, context={'request': request})
        recent_orders_reviews_serializer = OwnerRecentOrdersReviewsSerializer(instance={'recent_orders': recent_orders, 'recent_reviews': recent_reviews}, context={'request': request})
        
        data = {
            **revenue_orders_serializer.data,
            **recent_orders_reviews_serializer.data,
        }
        return Response(data, status=status.HTTP_200_OK)
            
    
        
class OwnerMostOrderedItemsAPIView(APIView):

    def get(self, request, uuid):
        user = request.user
        if not user.groups.filter(name='restaurant owner').exists():
            return Response({'error': 'User is not a restaurant owner'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            restaurant = Restaurant.objects.get(uuid=uuid)
        except Restaurant.DoesNotExist:
            return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)
        
        period = request.query_params.get('period', 'all_time')
        now = timezone.now()
        
        if period == "week":
            start = now - timezone.timedelta(days=now.weekday())
        elif period == "month":
            start = now.replace(day=1)
        elif period == 'all_time':
            start = None
        
        menu_items = restaurant.menu_items.filter(is_side_item=False)
        
        if start:
            items = (
                OrderItem.objects
                .filter(menu_item__in=menu_items, order__created_at__gte=start)
                .values("menu_item__name")
                .annotate(orders=Count("order", distinct=True))
                .order_by("-orders")[:5]
            )
        else:
            items = sorted(menu_items, key=attrgetter("popularity"), reverse=True)[:5]
        
        if start:
            data = [
                {"item": item['menu_item__name'], "orders": item['orders']}
                for item in items
            ]
        else:
            data = [
                {"item": item.name, "orders": item.popularity}
                for item in items
            ]

        return Response(data, status=status.HTTP_200_OK)


class OwnerHighestRatedItemsAPIView(APIView):
    
    def get(self, request, uuid):
        user = request.user
        if not user.groups.filter(name='restaurant owner').exists():
            return Response({'error': 'User is not a restaurant owner'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            restaurant = Restaurant.objects.get(uuid=uuid)
        except Restaurant.DoesNotExist:
            return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)
        
        menu_items = restaurant.menu_items.filter(is_side_item=False)
        items = sorted(menu_items, key=attrgetter("rating"), reverse=True)[:5]
        
        data = [
            {"item": item.name, "rating": item.rating}
            for item in items
        ]
        
        return Response(data, status=status.HTTP_200_OK)
    
    
class OwnerPendingOrdersAPIView(generics.ListAPIView):
    serializer_class = OrderReadSerializer
    pagination_class = MyPageNumberPagination
    
    def get_queryset(self):
        user = self.request.user;
        
        if not user.groups.filter(name='restaurant owner').exists():
            return Response({'error': 'User is not a restaurant owner'}, status=status.HTTP_403_FORBIDDEN)
        else:
            restaurants = Restaurant.objects.filter(owner=user);
            qs = Order.objects.filter(restaurant__in=restaurants, order_status=Order.OrderStatus.PENDING).order_by('-created_at');
            
            restaurant_uuid = self.request.query_params.get('restaurant');
            payment_method = self.request.query_params.get('payment_method');
            
            if restaurant_uuid is not None:
                qs = qs.filter(restaurant__uuid=restaurant_uuid)
            
            if payment_method is not None:
                qs = qs.filter(payment_method=payment_method)
                
            return qs

                
class OwnerOrdersAPIView(generics.GenericAPIView):
    serializer_class = OwnerOrdersSerializer
    
    def get(self, request):
        user = request.user
        if not user.groups.filter(name='restaurant owner').exists():
            return Response({'error': 'User is not a restaurant owner'}, status=status.HTTP_403_FORBIDDEN)
        
        restaurants = Restaurant.objects.filter(owner=user)
        orders = Order.objects.filter(restaurant__in=restaurants)
        delivered = orders.filter(order_status=Order.OrderStatus.DELIVERED).count()
        cancelled = orders.filter(order_status=Order.OrderStatus.CANCELLED).count()
        declined = orders.filter(order_status=Order.OrderStatus.DECLINED).count()
        
        total_orders = delivered + cancelled + declined

        if total_orders > 0:
            delivered_percentage = round((delivered / total_orders) * 100)
            cancelled_percentage = round((cancelled / total_orders) * 100)
            declined_percentage = round((declined / total_orders) * 100)
        else:
            delivered_percentage = cancelled_percentage = declined_percentage = 0
        
        data = {
            'delivered_orders': delivered,
            'cancelled_orders': cancelled,
            'declined_orders': declined,
            'delivered_percentage': delivered_percentage,
            'cancelled_percentage': cancelled_percentage,
            'declined_percentage': declined_percentage,
        }
        
        serializer = self.get_serializer(instance=data)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
        
