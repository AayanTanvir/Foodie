from django.conf import settings
from django.core.cache import cache
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status
from .models import *
from .utils import Utils
from .serializers import *
import random, jwt


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
            raise ValidationError("No user found with the given UUID")
    
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
            raise ValidationError("No restaurant found with the given UUID")
        
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class ReviewCreateAPIView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewWriteSerializer
    

class UserRestaurantsAPIView(generics.ListAPIView):
    serializer_class = RestaurantListSerializer

    def get_queryset(self):
        try:
            user_uuid = self.kwargs['uuid']
            user = CustomUser.objects.get(uuid=user_uuid)
            return Restaurant.objects.filter(owner=user)
        except CustomUser.DoesNotExist:
            raise ValidationError("User with the given UUID does not exist")
        
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)