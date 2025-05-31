from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from .models import *
from django.core.cache import cache


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['uuid'] = str(user.uuid)
        token['email'] = user.email
        token['username'] = user.username
        token['is_email_verified'] = user.is_email_verified

        return token
    
    
class CustomUserWriteSerializer(serializers.ModelSerializer):
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
        fields = ['uuid', 'restaurant_uuid', 'restaurant_name', 'name', 'description', 'category', 'price',
                  'image', 'is_available', 'is_side_item', 'created_at', 'popularity']
        

class MenuItemCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItemCategory
        fields = ['name']
    
    
class RestaurantDiscountSerializer(serializers.ModelSerializer):
    is_valid = serializers.SerializerMethodField()
    uuid = serializers.UUIDField()
    
    def get_is_valid(self, obj):
        return obj.is_valid
    
    
    class Meta:
        model = Discount
        fields = ['uuid', 'valid_from', 'valid_to', 'discount_type', 'amount',
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


class OrderItemWriteSerializer(serializers.ModelSerializer):
    menu_item_uuid = serializers.UUIDField(write_only=True)
    modifiers = serializers.PrimaryKeyRelatedField(
        queryset=MenuItemModifierChoice.objects.all(),
        many=True,
        required=False,
        write_only=True
    )
    
    def get_subtotal(self, obj):
        return obj.subtotal
    
    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item_uuid', 'quantity', 'modifiers', 'subtotal', 'special_instruction']

    def create(self, validated_data):
        order = self.context.get('order')
        menu_item_uuid = validated_data.pop('menu_item_uuid')
        menu_item = MenuItem.objects.get(uuid=menu_item_uuid)

        modifiers = validated_data.pop('modifiers', [])
        
        order_item = OrderItem.objects.create(order=order, menu_item=menu_item, **validated_data)
        order_item.modifiers.set(modifiers)

        return order_item


class OrderItemReadSerializer(serializers.ModelSerializer):
    modifiers = MenuItemModifierChoiceSerializer(many=True, read_only=True)
    menu_item = MenuItemSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField(read_only=True)
    
    def get_subtotal(self, obj):
        return obj.subtotal
    
    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'quantity', 'modifiers', 'subtotal', 'special_instruction']
        

class OrderWriteSerializer(serializers.ModelSerializer):
    order_items_write = OrderItemWriteSerializer(many=True, write_only=True)
    restaurant_uuid = serializers.UUIDField(source='restaurant.uuid', write_only=True)
    user_uuid = serializers.UUIDField(source='user.uuid', write_only=True)
    discount_uuid = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    
    def validate_user_uuid(self, value):
        if not CustomUser.objects.filter(uuid=value).exists():
            raise serializers.ValidationError("User with this UUID does not exist.")
        return value
    
    def validate_restaurant_uuid(self, value):
        if not Restaurant.objects.filter(uuid=value).exists():
            raise serializers.ValidationError("Restaurant with this UUID does not exist.")
        return value
    
    def validate_payment_method(self, value):
        if value not in ['cash_on_delivery', 'card']:
            raise serializers.ValidationError("Invalid payment method. Choose either 'cash_on_delivery' or 'card'.")
        return value

    def validate(self, data):
        if not data.get('order_items_write'):
            raise serializers.ValidationError("Order must have at least one item.")
        if not data.get('delivery_address'):
            raise serializers.ValidationError("Delivery address is required.")
        if not data.get('user'):
            raise serializers.ValidationError("User UUID is required.")
        if not data.get('restaurant'):
            raise serializers.ValidationError("Restaurant UUID is required.")
        if not data.get('payment_method'):
            raise serializers.ValidationError("Payment method is required.")
        return super().validate(data)

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items_write')
        user_data = validated_data.pop('user')
        restaurant_data = validated_data.pop('restaurant')
        discount_uuid = validated_data.pop('discount_uuid', None)

        user = CustomUser.objects.get(uuid=user_data['uuid'])
        restaurant = Restaurant.objects.get(uuid=restaurant_data['uuid'])

        order_payload = {**validated_data}
        
        if discount_uuid:
            try:
                discount = Discount.objects.get(uuid=discount_uuid)
                order_payload['discount'] = discount
            except Discount.DoesNotExist:
                raise serializers.ValidationError("Incorrect discount UUID")

        order = Order.objects.create(user=user, restaurant=restaurant, **order_payload)
        
        order_item_serializer_for_create = OrderItemWriteSerializer(context={'order':order})

        for item_validated_sub_data  in order_items_data:
            order_item_serializer_for_create.create(validated_data=item_validated_sub_data)

        return order

    class Meta:
        model = Order
        fields = [
            'uuid', 'restaurant_uuid', 'user_uuid', 'order_items_write', 
            'payment_method', 'delivery_address', 'discount_uuid'
        ]


class OrderReadSerializer(serializers.ModelSerializer):
    order_items = OrderItemReadSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    discounted_price = serializers.SerializerMethodField()
    user_uuid = serializers.UUIDField(source="user.uuid", read_only=True)
    restaurant_uuid = serializers.UUIDField(source="restaurant.uuid", read_only=True)
    restaurant_name = serializers.CharField(source="restaurant.name", read_only=True)
    discount_uuid = serializers.UUIDField(source="discount.uuid", read_only=True)
    
    def get_discounted_price(self, obj):
        return obj.discounted_price
    
    def get_total_price(self, obj):
        return obj.total_price
    
    def validate_order_uuid(self, value):
        if not Order.objects.filter(uuid=value).exists():
            raise serializers.ValidationError("Invalid UUID")
        return value
    
    
    class Meta:
        model = Order
        fields = [
            'uuid', 'user_uuid', 'restaurant_uuid', 'restaurant_name', 
            'total_price', 'discounted_price', 'discount_uuid', 'order_items',
            'payment_method', 'delivery_address', 'order_status', 'created_at'
        ]
        

class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['order_status']
        
        
class OrderListSerializer(serializers.ModelSerializer):
    user_uuid = serializers.UUIDField(source="user.uuid", read_only=True)
    restaurant_uuid = serializers.UUIDField(source="restaurant.uuid", read_only=True)
    restaurant_name = serializers.CharField(source="restaurant.name", read_only=True)
    total_price = serializers.SerializerMethodField()
    discounted_price = serializers.SerializerMethodField()

    def get_total_price(self, obj):
        return obj.total_price
    
    def get_discounted_price(self, obj):
        return obj.discounted_price
    
    class Meta:
        model = Order
        fields = [
            'uuid', 'user_uuid', 'restaurant_uuid', 'restaurant_name',
            'total_price', 'discounted_price', 'order_status', 'created_at'
        ]
        

class CustomUserReadSerializer(serializers.ModelSerializer):
    
    
    class Meta:
        model = CustomUser
        fields = [
            'date_joined', 'uuid', 'username', 'email', 'is_email_verified',
        ]
