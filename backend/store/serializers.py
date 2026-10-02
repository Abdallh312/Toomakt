from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Flavor,
    Category,
    Product,
    ProductVariant,
    ProductMedia,
    Bundle,
    Review,
    Coupon,
    Order,
    OrderItem,
    HomepageSection,
    CMSPage,
    GlobalSetting,
    ContactMessage,
    NewsletterSubscriber,
    AuditLog,
    ShippingRate,
    WholesaleRequest,
    PaymentConfirmation,
    AdminNotification
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'date_joined']
        read_only_fields = ['id', 'is_staff', 'is_superuser', 'date_joined']


class FlavorSerializer(serializers.ModelSerializer):
    products_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model = Flavor
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model = Category
        fields = '__all__'


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = '__all__'


class ProductMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMedia
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    flavor_name = serializers.CharField(source='flavor.name', read_only=True)
    flavor_color = serializers.CharField(source='flavor.color', read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    gallery = ProductMediaSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'


class BundleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bundle
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class PaymentConfirmationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentConfirmation
        fields = '__all__'
        read_only_fields = ['id', 'submission_date']


class AdminNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminNotification
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment_confirmations = PaymentConfirmationSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['id', 'order_number', 'created_at', 'updated_at']


class HomepageSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomepageSection
        fields = '__all__'


class CMSPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CMSPage
        fields = '__all__'


class GlobalSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalSetting
        fields = '__all__'


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = '__all__'
        read_only_fields = ['id', 'promo_code_issued', 'created_at']


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'


class ShippingRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingRate
        fields = '__all__'


class StringOrListField(serializers.Field):
    def to_internal_value(self, data):
        if isinstance(data, list):
            return ', '.join(str(x) for x in data)
        return str(data) if data is not None else ''

    def to_representation(self, value):
        return value or ''


class WholesaleRequestSerializer(serializers.ModelSerializer):
    products_interested = StringOrListField(required=False, allow_null=True, default='')
    city = serializers.CharField(required=False, allow_blank=True, default='Cairo')
    business_type = serializers.CharField(required=False, allow_blank=True, default='Boutique Cafe & Retail')
    company_name = serializers.CharField(required=False, allow_blank=True, default='Independent Partner')
    requested_quantity = serializers.IntegerField(required=False, default=100)

    class Meta:
        model = WholesaleRequest
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

