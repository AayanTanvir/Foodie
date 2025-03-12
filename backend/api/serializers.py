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
    
    
class MenuItemCategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = MenuItemCategory
        fields = ['name']
    
    
class MenuItemSerializer(serializers.ModelSerializer):
    category = MenuItemCategorySerializer()

    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'category', 'price',
                  'image', 'is_available', 'created_at']
    
    
class RestaurantSerializer(serializers.ModelSerializer):
    menu_items = MenuItemSerializer(many=True, read_only=True)
    is_open = serializers.SerializerMethodField(method_name='is_open')
    
    def is_open(self, obj):
        return obj.is_open
     
    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'owner', 'slug', 'image',
            'address', 'phone', 'category', 'is_open', 'opening_time',
            'closing_time', 'is_verified', 'is_maintained', 'created_at', 'menu_items',
        ]
        
    
class RestaurantListSerializer(serializers.ModelSerializer):
    is_open = serializers.SerializerMethodField(method_name='is_open')
    category = serializers.SerializerMethodField()
    
    def is_open(self, obj):
        return obj.is_open
    
    def get_category(self, obj):
        return obj.get_category_display()
    
    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'slug', 'image',
                  'category', 'is_verified', 'is_open']