from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView,
    LoginView,
    AdminLoginView,
    ProductViewSet,
    FlavorViewSet,
    CategoryViewSet,
    BundleViewSet,
    ReviewViewSet,
    CMSPageViewSet,
    HomepageView,
    GlobalSettingsView,
    ValidatePromoCodeView,
    CheckoutView,
    OrderTrackView,
    ContactSubmitView,
    NewsletterSubscribeView,
    OrderInvoiceDownloadView,
    ShippingRateViewSet,
    ShippingRatesView,
    WholesaleRequestViewSet,
    AdminDashboardStatsView,
    AdminAnalyticsView,
    AdminProductViewSet,
    AdminFlavorViewSet,
    AdminCategoryViewSet,
    AdminOrderViewSet,
    AdminCouponViewSet,
    AdminReviewViewSet,
    AdminCMSPageViewSet,
    AdminHomepageBuilderViewSet,
    AdminSettingsViewSet,
    AdminContactMessagesViewSet,
    AdminSubscriberViewSet,
    AdminAuditLogViewSet,
    AdminWholesaleViewSet,
    AdminPaymentConfirmationViewSet,
    AdminNotificationViewSet,
    PaymentConfirmationSubmitView,
    ShippingCalculateView,
    AdminReportsView,
    DatabaseStatusView
)

# Storefront router
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='store-product')
router.register(r'flavors', FlavorViewSet, basename='store-flavor')
router.register(r'categories', CategoryViewSet, basename='store-category')
router.register(r'bundles', BundleViewSet, basename='store-bundle')
router.register(r'reviews', ReviewViewSet, basename='store-review')
router.register(r'pages', CMSPageViewSet, basename='store-page')
router.register(r'coupons', AdminCouponViewSet, basename='store-coupon')
router.register(r'shipping-rates', ShippingRateViewSet, basename='store-shipping-rate')
router.register(r'wholesale', WholesaleRequestViewSet, basename='store-wholesale')

# Admin router
admin_router = DefaultRouter()
admin_router.register(r'products', AdminProductViewSet, basename='admin-product')
admin_router.register(r'flavors', AdminFlavorViewSet, basename='admin-flavor')
admin_router.register(r'categories', AdminCategoryViewSet, basename='admin-category')
admin_router.register(r'orders', AdminOrderViewSet, basename='admin-order')
admin_router.register(r'payment-confirmations', AdminPaymentConfirmationViewSet, basename='admin-payment-confirmation')
admin_router.register(r'notifications', AdminNotificationViewSet, basename='admin-notification')
admin_router.register(r'coupons', AdminCouponViewSet, basename='admin-coupon')
admin_router.register(r'reviews', AdminReviewViewSet, basename='admin-review')
admin_router.register(r'cms-pages', AdminCMSPageViewSet, basename='admin-cms-page')
admin_router.register(r'homepage-sections', AdminHomepageBuilderViewSet, basename='admin-homepage-builder')
admin_router.register(r'messages', AdminContactMessagesViewSet, basename='admin-message')
admin_router.register(r'subscribers', AdminSubscriberViewSet, basename='admin-subscriber')
admin_router.register(r'audit-logs', AdminAuditLogViewSet, basename='admin-audit-log')
admin_router.register(r'shipping-rates', ShippingRateViewSet, basename='admin-shipping-rate')
admin_router.register(r'wholesale', AdminWholesaleViewSet, basename='admin-wholesale')

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/admin-login/', AdminLoginView.as_view(), name='auth-admin-login'),

    # Storefront Custom
    path('homepage/', HomepageView.as_view(), name='store-homepage'),
    path('settings/', GlobalSettingsView.as_view(), name='store-settings'),
    path('promo/validate/', ValidatePromoCodeView.as_view(), name='store-validate-promo'),
    path('shipping/calculate/', ShippingCalculateView.as_view(), name='store-shipping-calculate'),
    path('checkout/', CheckoutView.as_view(), name='store-checkout'),
    path('orders/track/', OrderTrackView.as_view(), name='store-track-order'),
    path('orders/<str:order_number>/invoice/', OrderInvoiceDownloadView.as_view(), name='store-order-invoice'),
    path('orders/<str:order_number>/payment-confirmation/', PaymentConfirmationSubmitView.as_view(), name='store-order-payment-confirmation'),
    path('contact/', ContactSubmitView.as_view(), name='store-contact'),
    path('newsletter/subscribe/', NewsletterSubscribeView.as_view(), name='store-newsletter'),
    path('database/status/', DatabaseStatusView.as_view(), name='database-status'),

    # Admin Custom
    path('admin/dashboard/stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    path('admin/analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
    path('admin/reports/', AdminReportsView.as_view(), name='admin-reports'),
    path('admin/settings/', AdminSettingsViewSet.as_view(), name='admin-settings'),

    # Routers
    path('', include(router.urls)),
    path('admin/', include(admin_router.urls)),
]

