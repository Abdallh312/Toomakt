import uuid
from django.db import models
from django.contrib.auth.models import User


class Flavor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=150, unique=True)
    description = models.TextField(blank=True, default='')
    color = models.CharField(max_length=30, default='#C26715')
    secondary_color = models.CharField(max_length=30, default='#FDF3E7')
    image_url = models.CharField(max_length=500, blank=True, default='')
    icon = models.CharField(max_length=100, blank=True, default='Sparkles')
    banner_url = models.CharField(max_length=500, blank=True, default='')
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    seo_title = models.CharField(max_length=200, blank=True, default='')
    seo_description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'toomakt_flavors'
        ordering = ['name']

    def __str__(self):
        return self.name


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=150, unique=True)
    description = models.TextField(blank=True, default='')
    banner_url = models.CharField(max_length=500, blank=True, default='')
    image_url = models.CharField(max_length=500, blank=True, default='')
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    seo_title = models.CharField(max_length=200, blank=True, default='')
    seo_description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'toomakt_categories'
        verbose_name_plural = 'Categories'
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name


class Product(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sku = models.CharField(max_length=100, unique=True, blank=True, default='')
    name = models.CharField(max_length=200)
    tagline = models.CharField(max_length=255, blank=True, default='')
    slug = models.SlugField(max_length=200, unique=True)
    short_description = models.CharField(max_length=255, blank=True, default='')
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    flavor = models.ForeignKey(Flavor, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    brand = models.CharField(max_length=100, default='toomakt')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_at_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock_quantity = models.IntegerField(default=100)
    low_stock_threshold = models.IntegerField(default=15)
    pieces_per_pack = models.PositiveIntegerField(default=20)
    weight = models.CharField(max_length=100, default='180g Pouch')
    dimensions = models.CharField(max_length=100, blank=True, default='')
    badge = models.CharField(max_length=100, blank=True, null=True)
    badge_type = models.CharField(max_length=50, default='gold')
    accent_color = models.CharField(max_length=30, default='#C26715')
    light_bg_color = models.CharField(max_length=30, default='#FAF5EE')
    image_url = models.CharField(max_length=500)
    chewiness = models.DecimalField(max_digits=4, decimal_places=1, default=10.0)
    fruit_impact_label = models.CharField(max_length=100, default='Fruit Tartness')
    fruit_impact_score = models.DecimalField(max_digits=4, decimal_places=1, default=9.0)
    fruit_notes = models.JSONField(default=list, blank=True)
    ingredients = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='published')
    in_stock = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_best_seller = models.BooleanField(default=False)
    is_new_arrival = models.BooleanField(default=False)
    is_limited_edition = models.BooleanField(default=False)
    seo_title = models.CharField(max_length=200, blank=True, default='')
    seo_description = models.TextField(blank=True, default='')
    seo_keywords = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'toomakt_products'
        ordering = ['-is_featured', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.sku:
            self.sku = f"TMK-{self.slug[:8].upper()}-{str(self.id)[:4].upper()}"
        try:
            if not hasattr(self.stock_quantity, 'resolve_expression') and self.stock_quantity is not None:
                self.in_stock = int(self.stock_quantity) > 0
        except Exception:
            pass
        super().save(*args, **kwargs)


class ProductVariant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    sku = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=150)  # e.g. "180g Pouch", "250g Cylindrical Tin", "500g Tasting Box"
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_at_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock_quantity = models.IntegerField(default=50)
    weight = models.CharField(max_length=100)
    image_url = models.CharField(max_length=500, blank=True, default='')
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'toomakt_product_variants'
        ordering = ['price']

    def __str__(self):
        return f"{self.product.name} - {self.title}"


class ProductMedia(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='gallery')
    media_type = models.CharField(max_length=30, choices=[('image', 'Image'), ('video', 'Video')], default='image')
    url = models.CharField(max_length=500)
    alt_text = models.CharField(max_length=255, blank=True, default='')
    caption = models.CharField(max_length=255, blank=True, default='')
    display_order = models.PositiveIntegerField(default=0)
    is_cover = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'toomakt_product_media'
        ordering = ['display_order', 'created_at']


class Bundle(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    category = models.CharField(max_length=100, default='Curated Gift Box')
    badge = models.CharField(max_length=150, blank=True, null=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_at_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    weight = models.CharField(max_length=100, default='450G LUXURY TIN')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.0)
    review_count = models.PositiveIntegerField(default=0)
    image_url = models.CharField(max_length=500)
    perk_note = models.CharField(max_length=255, blank=True, null=True)
    is_grand_feature = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'toomakt_bundles'
        ordering = ['-is_grand_feature', 'price']

    def __str__(self):
        return self.title


class Review(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews')
    product_tag = models.CharField(max_length=100)
    author = models.CharField(max_length=150)
    email = models.EmailField(blank=True, default='')
    location = models.CharField(max_length=150)
    role = models.CharField(max_length=100, default='Verified Buyer')
    rating = models.PositiveSmallIntegerField(default=5)
    title = models.CharField(max_length=255)
    content = models.TextField()
    admin_reply = models.TextField(blank=True, default='')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='approved')
    is_verified = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'toomakt_reviews'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.author} - {self.product_tag} ({self.rating}★)"


class Coupon(models.Model):
    DISCOUNT_TYPES = [
        ('percentage', 'Percentage Discount (%)'),
        ('fixed', 'Fixed Amount Discount (EGP)'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPES, default='percentage')
    discount_value = models.DecimalField(max_digits=10, decimal_places=2, default=10.0)
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    max_discount_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    usage_limit = models.PositiveIntegerField(null=True, blank=True)
    times_used = models.PositiveIntegerField(default=0)
    per_customer_limit = models.PositiveIntegerField(default=1)
    start_date = models.DateTimeField(null=True, blank=True)
    expiry_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'toomakt_promo_codes'

    def __str__(self):
        return f"{self.code} ({self.discount_value}{'%' if self.discount_type == 'percentage' else ' EGP'})"


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Confirmation'),
        ('waiting_for_payment', 'Waiting for Payment'),
        ('payment_review', 'Payment Review'),
        ('confirmed', 'Confirmed'),
        ('paid', 'Paid'),
        ('preparing', 'Preparing Order'),
        ('processing', 'Processing in Atelier'),
        ('packed', 'Packed in Insulated Cooler'),
        ('shipped', 'Shipped via Express'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('payment_rejected', 'Payment Rejected'),
        ('refunded', 'Refunded'),
    ]

    PAYMENT_METHODS = [
        ('instapay', 'InstaPay / Bank Transfer'),
        ('cod', 'Cash On Delivery'),
        ('card', 'Credit / Debit Card (Online)'),
        ('bank', 'Direct Bank Wire'),
        ('apple_pay', 'Apple Pay / Digital Wallet'),
    ]

    PAYMENT_STATUS = [
        ('pending', 'Pending Payment'),
        ('waiting_verification', 'Waiting Payment Verification'),
        ('authorized', 'Authorized'),
        ('paid', 'Paid in Full'),
        ('rejected', 'Payment Rejected'),
        ('failed', 'Payment Failed'),
        ('refunded', 'Refunded'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(max_length=50, unique=True)
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    customer_name = models.CharField(max_length=150)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=50, blank=True, null=True)
    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=100, blank=True, default='')
    governorate = models.CharField(max_length=100, default='Cairo')
    shipping_country = models.CharField(max_length=100, default='Egypt')
    building_number = models.CharField(max_length=50, blank=True, default='')
    apartment_floor = models.CharField(max_length=50, blank=True, default='')
    delivery_notes = models.TextField(blank=True, default='')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    promo_code = models.CharField(max_length=50, blank=True, null=True)
    payment_method = models.CharField(max_length=30, choices=PAYMENT_METHODS, default='instapay')
    payment_status = models.CharField(max_length=30, choices=PAYMENT_STATUS, default='pending')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending')
    payment_proof_url = models.TextField(blank=True, default='')
    payment_reviewed_by = models.CharField(max_length=150, blank=True, default='')
    payment_reviewed_at = models.DateTimeField(null=True, blank=True)
    payment_rejection_reason = models.TextField(blank=True, default='')
    internal_notes = models.TextField(blank=True, default='')
    tracking_number = models.CharField(max_length=100, blank=True, default='')
    timeline = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'toomakt_orders'
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.order_number} ({self.customer_name})"


class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    variant = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True, blank=True)
    item_type = models.CharField(max_length=50, default='product')
    item_id = models.CharField(max_length=100)
    sku = models.CharField(max_length=100, blank=True, default='')
    name = models.CharField(max_length=200)
    product_name_snapshot = models.CharField(max_length=200, blank=True, default='')
    price_snapshot = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    pieces_per_pack_snapshot = models.PositiveIntegerField(default=20)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.CharField(max_length=500, blank=True, default='')

    class Meta:
        db_table = 'toomakt_order_items'

    def __str__(self):
        return f"{self.name} x {self.quantity}"


class HomepageSection(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    section_key = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=200)
    subtitle = models.TextField(blank=True, default='')
    content = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'toomakt_homepage_sections'
        ordering = ['display_order']

    def __str__(self):
        return f"{self.display_order}. {self.title} ({self.section_key})"


class CMSPage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    content = models.TextField()
    featured_image = models.CharField(max_length=500, blank=True, default='')
    visibility = models.CharField(max_length=30, choices=[('published', 'Published'), ('draft', 'Draft'), ('hidden', 'Hidden')], default='published')
    seo_title = models.CharField(max_length=200, blank=True, default='')
    seo_description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'toomakt_cms_pages'
        ordering = ['title']

    def __str__(self):
        return self.title


class GlobalSetting(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.CharField(max_length=50, default='general')
    key = models.CharField(max_length=100, unique=True)
    label = models.CharField(max_length=150, blank=True, default='')
    value = models.JSONField(default=dict, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'toomakt_global_settings'
        ordering = ['category', 'key']

    def __str__(self):
        return f"[{self.category}] {self.key}"


class ContactMessage(models.Model):
    STATUS_CHOICES = [
        ('unread', 'Unread'),
        ('read', 'Read'),
        ('replied', 'Replied'),
        ('archived', 'Archived'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True, default='')
    subject = models.CharField(max_length=200, default='Inquiry')
    message = models.TextField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='unread')
    internal_notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'toomakt_contact_messages'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.subject} ({self.status})"


class NewsletterSubscriber(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    source = models.CharField(max_length=100, default='footer')
    promo_code_issued = models.CharField(max_length=50, default='TOOMAKT10')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'toomakt_subscribers'
        ordering = ['-created_at']

    def __str__(self):
        return self.email


class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.CharField(max_length=150, default='Admin')
    action = models.CharField(max_length=100)  # e.g. "PRODUCT_UPDATE", "ORDER_STATUS_CHANGE"
    entity_type = models.CharField(max_length=100)
    entity_id = models.CharField(max_length=100, blank=True, default='')
    description = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'toomakt_audit_logs'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.created_at.strftime('%Y-%m-%d %H:%M')} | {self.user} | {self.action}: {self.description[:40]}"


class ShippingRate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    governorate = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=50.00)
    estimated_delivery = models.CharField(max_length=100, default='1–3 Days')
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'toomakt_shipping_rates'
        ordering = ['governorate']

    def __str__(self):
        return f"{self.governorate}: {self.price} EGP ({self.estimated_delivery})"


class WholesaleRequest(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('quoted', 'Quoted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('archived', 'Archived'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    company_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    whatsapp = models.CharField(max_length=50, blank=True, default='')
    governorate = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    business_type = models.CharField(max_length=100)
    products_interested = models.TextField(blank=True, default='')
    requested_quantity = models.PositiveIntegerField(default=100)
    monthly_quantity = models.PositiveIntegerField(null=True, blank=True)
    message = models.TextField(blank=True, default='')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='new')
    internal_notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'toomakt_wholesale_requests'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.company_name} ({self.name}) - {self.requested_quantity} packs"


class PaymentConfirmation(models.Model):
    VERIFICATION_STATUS = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payment_confirmations')
    order_number = models.CharField(max_length=50)
    customer_name = models.CharField(max_length=150)
    customer_phone = models.CharField(max_length=50, blank=True, default='')
    order_total = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    payment_method = models.CharField(max_length=30, default='instapay')
    transfer_amount = models.DecimalField(max_digits=10, decimal_places=2)
    transfer_reference = models.CharField(max_length=150, blank=True, default='')
    payment_screenshot = models.TextField(blank=True, default='')
    submission_date = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=30, default='waiting_verification')
    verification_status = models.CharField(max_length=30, choices=VERIFICATION_STATUS, default='pending')
    admin_reviewer = models.CharField(max_length=150, blank=True, default='')
    admin_review_date = models.DateTimeField(null=True, blank=True)
    admin_notes = models.TextField(blank=True, default='')
    rejection_reason = models.TextField(blank=True, default='')

    class Meta:
        db_table = 'toomakt_payment_confirmations'
        ordering = ['-submission_date']

    def __str__(self):
        return f"Payment #{self.order_number} - {self.transfer_amount} EGP ({self.verification_status})"


class AdminNotification(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    notification_type = models.CharField(max_length=50)  # new_order, payment_confirmation, payment_approved, payment_rejected, low_stock, critical_stock, out_of_stock
    title = models.CharField(max_length=200)
    message = models.TextField()
    related_order_id = models.CharField(max_length=100, blank=True, default='')
    related_order_number = models.CharField(max_length=100, blank=True, default='')
    related_product_id = models.CharField(max_length=100, blank=True, default='')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'toomakt_notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.priority.upper()}] {self.title} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class TelegramAdminUser(models.Model):
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin / Owner'),
        ('atelier_manager', 'Atelier Kitchen Manager'),
        ('logistics', 'Packaging & Delivery Staff'),
        ('admin', 'Store Admin'),
    ]

    telegram_id = models.CharField(max_length=64, unique=True, help_text="Numeric Telegram User ID")
    first_name = models.CharField(max_length=150, blank=True, default='')
    last_name = models.CharField(max_length=150, blank=True, default='')
    username = models.CharField(max_length=150, blank=True, default='', help_text="Telegram username without @")
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='admin')
    is_active = models.BooleanField(default=True, help_text="Whether this user is authorized to use the bot")
    can_receive_alerts = models.BooleanField(default=True, help_text="Receive instant notifications for new orders")
    can_manage_orders = models.BooleanField(default=True, help_text="Allowed to view and manage orders via bot")
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'toomakt_telegram_admins'
        verbose_name = 'Telegram Admin'
        verbose_name_plural = 'Telegram Admins'
        ordering = ['-created_at']

    def __str__(self):
        name = f"{self.first_name} {self.last_name}".strip() or self.username or self.telegram_id
        return f"{name} ({self.telegram_id}) - [{self.role}] {'Active' if self.is_active else 'Disabled'}"


