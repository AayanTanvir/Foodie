from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from .models import *
from django.core.cache import cache


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['email'] = user.email
        token['username'] = user.username
        token['is_email_verified'] = user.is_email_verified

        return token
    
    
class CustomUserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password1', 'password2']
        
    
    def validate(self, data):
        password1 = data.get('password1')
        password2 = data.get('password2')
        if password1 != password2:
            raise serializers.ValidationError("Passwords do not match")
        
        return super().validate(data)
    
    def create(self, validated_data):
        user = CustomUser(
            email=validated_data["email"],
            username=validated_data["username"]
        )
        user.set_password(validated_data["password1"])
        user.save()
        return user
    

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    
    def validate_email(self, value):
        if not CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist")
        
        return value
    

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    password = serializers.CharField(required=True)


class EmailVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    mode = serializers.CharField(required=True)
    
    def validate_email(self, value):
        if not CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist")
        
        return value
    

class OTPVerificationSerializer(serializers.Serializer):
    otp = serializers.IntegerField(required=True)
    email = serializers.EmailField(required=True)
    
    def validate(self, data):
        otp = data.get('otp')
        email = data.get('email')
        cached_otp = cache.get(f"otp_{email}")
        
        if not CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError("User with this email does not exist")
        elif cached_otp == None:
            raise serializers.ValidationError("OTP has expired")
        elif otp != cached_otp:
            raise serializers.ValidationError("Invalid OTP")
        
        return super().validate(data)
   
    
class MenuItemSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        queryset=MenuItemCategory.objects.all(), slug_field='name'
    )
    popularity = serializers.SerializerMethodField()
    restaurant_uuid = serializers.UUIDField(source='restaurant.uuid', read_only=True)
    restaurant_name = serializers.SlugField(source='restaurant.name', read_only=True)
    
    def get_popularity(self, obj):
        return obj.popularity

    class Meta:
        model = MenuItem
        fields = ['id', 'restaurant_uuid', 'restaurant_name', 'name', 'description', 'category', 'price',
                  'image', 'is_available', 'is_side_item', 'created_at', 'popularity']
        

class MenuItemCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItemCategory
        fields = ['name']
    
    
class RestaurantDiscountSerializer(serializers.ModelSerializer):
    is_valid = serializers.SerializerMethodField()
    
    def get_is_valid(self, obj):
        return obj.is_valid
    
    
    class Meta:
        model = Discount
        fields = ['id', 'valid_from', 'valid_to', 'discount_type', 'amount',
                  'min_order_amount', 'is_valid']
    
    
class RestaurantSerializer(serializers.ModelSerializer):
    menu_items = MenuItemSerializer(many=True)
    is_open = serializers.SerializerMethodField(method_name='is_open')
    restaurant_category = serializers.SerializerMethodField()
    item_categories = serializers.SerializerMethodField()
    
    def get_restaurant_category(self, obj):
        return obj.get_category_display()
    
    def get_item_categories(self, obj):
        return MenuItemCategorySerializer(MenuItemCategory.objects.filter(restaurant=obj), many=True).data
    
    def is_open(self, obj):
        return obj.is_open
    
    
    class Meta:
        model = Restaurant
        fields = [
            'uuid', 'name', 'owner', 'slug', 'image',
            'address', 'phone', 'restaurant_category', 'is_open', 'opening_time',
            'closing_time', 'is_verified', 'created_at', 'menu_items',
            'item_categories',
        ]
        
    
class RestaurantListSerializer(serializers.ModelSerializer):
    is_open = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    popularity = serializers.SerializerMethodField()
    
    def get_is_open(self, obj):
        return obj.is_open
    
    def get_category(self, obj):
        return obj.get_category_display()
    
    def get_popularity(self, obj):
        return obj.popularity
    
    class Meta:
        model = Restaurant
        fields = ['uuid', 'name', 'slug', 'image',
                  'category', 'is_verified', 'is_open', 'opening_time',
                  'closing_time', 'popularity',]


class MenuItemModifierChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItemModifierChoice
        fields = ['id', 'label', 'price']


class MenuItemModifierSerializer(serializers.ModelSerializer):
    choices = MenuItemModifierChoiceSerializer(many=True, required=False)
    menu_item = serializers.SlugRelatedField(
        queryset=MenuItem.objects.all(), slug_field='name'
    )
    
    class Meta:
        model = MenuItemModifier
        fields = ['id', 'menu_item', 'name', 'is_required', 'is_multiselect', 'created_at', 'choices']


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.SerializerMethodField()
    order_uuid = serializers.UUIDField(source='order.uuid', read_only=True)
    menu_item = MenuItemSerializer()
    modifiers = MenuItemModifierChoiceSerializer(many=True, required=False)
    
    def get_subtotal(self, obj):
        return obj.subtotal
    
    class Meta:
        model = OrderItem
        fields = ['id', 'order_uuid', 'menu_item', 'quantity', 'modifiers', 'subtotal', 'special_instruction']
        

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True)
    total_price = serializers.SerializerMethodField()
    discounted_price = serializers.SerializerMethodField()
    restaurant_uuid = serializers.UUIDField(source='restaurant.uuid')
    user_uuid = serializers.UUIDField(source='user.uuid')
    discount = RestaurantDiscountSerializer(required=False, allow_null=True)
    
    def get_discounted_price(self, obj):
        return obj.discounted_price
    
    def get_total_price(self, obj):
        return obj.total_price
    
    def validate(self, data):
        if not data.get('order_items'):
            raise serializers.ValidationError("Order must have at least one item.")
        if not data.get('delivery_address'):
            raise serializers.ValidationError("Delivery address is required.")
        if not data.get('user_uuid'):
            raise serializers.ValidationError("User UUID is required.")
        if not data.get('restaurant_uuid'):
            raise serializers.ValidationError("Restaurant UUID is required.")
        
        try: 
            user_uuid = data.get('user_uuid')
            user = CustomUser.objects.get(uuid=user_uuid)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Invalid User UUID.")

        try:
            restaurant_uuid = data.get('restaurant_uuid')
            restaurant = Restaurant.objects.get(uuid=restaurant_uuid)
        except Restaurant.DoesNotExist:
            raise serializers.ValidationError("Invalid Restaurant UUID.")

        return super().validate(data)

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items')
        order = Order.objects.create(**validated_data)
        
        for item_data in order_items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        return order

    class Meta:
        model = Order
        fields = ['uuid', 'restaurant_uuid', 'user_uuid', 'order_items', 'order_status', 'payment_method', 'total_price', 'discounted_price', 'delivery_address', 'discount', 'created_at']