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
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
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
    
    def get_popularity(self, obj):
        return obj.popularity

    class Meta:
        model = MenuItem
        fields = ['id', 'restaurant_uuid', 'name', 'description', 'category', 'price',
                  'image', 'is_available', 'created_at', 'popularity']
        

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
    menu_items = MenuItemSerializer(many=True, read_only=True)
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
