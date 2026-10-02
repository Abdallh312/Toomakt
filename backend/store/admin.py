from django.contrib import admin
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
    TelegramAdminUser
)



@admin.register(Flavor)
class FlavorAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'color', 'is_active', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'description']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'display_order', 'is_active', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


class ProductMediaInline(admin.TabularInline):
    model = ProductMedia
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'flavor', 'price', 'weight', 'stock_quantity', 'badge', 'is_featured', 'status']
    list_filter = ['category', 'flavor', 'status', 'is_featured', 'is_best_seller', 'is_new_arrival']
    search_fields = ['name', 'tagline', 'description', 'sku']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductVariantInline, ProductMediaInline]


@admin.register(Bundle)
class BundleAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'price', 'rating', 'review_count', 'is_grand_feature']
    list_filter = ['category', 'is_grand_feature']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['author', 'product_tag', 'rating', 'location', 'status', 'is_featured', 'created_at']
    list_filter = ['rating', 'status', 'is_featured']
    search_fields = ['author', 'title', 'content', 'product_tag']


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_type', 'discount_value', 'is_active', 'times_used', 'usage_limit', 'expiry_date']
    list_filter = ['discount_type', 'is_active']
    search_fields = ['code']


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['item_type', 'item_id', 'name', 'unit_price', 'quantity', 'total_price']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'customer_name', 'customer_email', 'total_amount', 'status', 'payment_status', 'created_at']
    list_filter = ['status', 'payment_status', 'created_at']
    search_fields = ['order_number', 'customer_name', 'customer_email']
    inlines = [OrderItemInline]
    readonly_fields = ['order_number', 'created_at', 'updated_at']


@admin.register(HomepageSection)
class HomepageSectionAdmin(admin.ModelAdmin):
    list_display = ['section_key', 'title', 'display_order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['title', 'subtitle']


@admin.register(CMSPage)
class CMSPageAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'visibility', 'updated_at']
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ['title', 'content']


@admin.register(GlobalSetting)
class GlobalSettingAdmin(admin.ModelAdmin):
    list_display = ['key', 'category', 'label', 'updated_at']
    list_filter = ['category']
    search_fields = ['key', 'label']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'email', 'message']


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ['email', 'source', 'is_active', 'created_at']
    search_fields = ['email']


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['action', 'entity_type', 'entity_id', 'user', 'created_at']
    list_filter = ['action', 'entity_type', 'created_at']
    search_fields = ['user', 'description', 'entity_id']
    readonly_fields = ['created_at']


@admin.register(TelegramAdminUser)
class TelegramAdminUserAdmin(admin.ModelAdmin):
    list_display = ['telegram_id', 'name_display', 'username', 'role', 'is_active', 'can_receive_alerts', 'can_manage_orders', 'created_at']
    list_filter = ['role', 'is_active', 'can_receive_alerts', 'can_manage_orders']
    search_fields = ['telegram_id', 'first_name', 'last_name', 'username', 'notes']
    readonly_fields = ['created_at', 'updated_at']

    def name_display(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username or obj.telegram_id
    name_display.short_description = 'Name'

