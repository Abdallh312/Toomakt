import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

import django

# Set up Django environment
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'toomakt_backend.settings')
django.setup()

from django.test import RequestFactory
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from store.models import Order, OrderItem, Product, Category, PaymentConfirmation, AdminNotification
from store.views import (
    CheckoutView,
    PaymentConfirmationSubmitView,
    AdminPaymentConfirmationViewSet,
    AdminOrderViewSet,
    AdminDashboardStatsView,
    AdminReportsView,
    ShippingCalculateView
)

def run_tests():
    print("=== STARTING FULL PRODUCTION E-COMMERCE END-TO-END VERIFICATION ===")
    client = APIClient()

    # 1. Setup Admin user
    admin_user, _ = User.objects.get_or_create(username='admin_tester', defaults={'is_staff': True, 'is_superuser': True})
    client.force_authenticate(user=admin_user)

    # 2. Setup Category and Product
    cat, _ = Category.objects.get_or_create(slug='fruit-chews', defaults={'name': 'Fruit Chews'})
    prod, _ = Product.objects.get_or_create(
        slug='raspberry-test-box',
        defaults={
            'name': 'Raspberry Velvet Toffee',
            'category': cat,
            'price': 120.00,
            'stock_quantity': 40,
            'low_stock_threshold': 15,
            'status': 'published'
        }
    )
    initial_stock = prod.stock_quantity
    print(f"Product initialized: {prod.name}, Stock: {initial_stock}, Price: {prod.price} EGP")

    # 3. Test Shipping Calculation Endpoint
    print("\n--- Testing Shipping Calculation (Server-side) ---")
    calc_res = client.post('/api/shipping/calculate/', {
        'governorate': 'cairo',
        'subtotal': 240.00
    }, format='json')
    assert calc_res.status_code == 200, f"Expected 200, got {calc_res.status_code}"
    calc_data = calc_res.json()
    assert calc_data['shipping_fee'] == 50.00
    assert calc_data['final_total'] == 290.00
    assert calc_data['is_free_shipping'] is False
    print("✓ Normal shipping fee calculated correctly: 50.00 EGP")

    # Test Free shipping threshold (>= 500 EGP)
    calc_free = client.post('/api/shipping/calculate/', {
        'governorate': 'alexandria',
        'subtotal': 600.00
    }, format='json')
    assert calc_free.status_code == 200
    free_data = calc_free.json()
    assert free_data['shipping_fee'] == 0.00
    assert free_data['is_free_shipping'] is True
    assert free_data['final_total'] == 600.00
    print("✓ Free shipping threshold applied correctly above 500 EGP")

    # 4. Test Customer Checkout with InstaPay
    print("\n--- Testing Order Placement with InstaPay ---")
    checkout_payload = {
        'customer_name': 'Amr Hassan',
        'customer_email': 'amr.hassan@example.com',
        'customer_phone': '01012345678',
        'shipping_address': 'Building 14, Degla Palms, 6th of October City',
        'governorate': 'Giza',
        'payment_method': 'instapay',
        'items': [
            {
                'product_id': prod.id,
                'quantity': 2,
                'price': 120.00
            }
        ]
    }
    order_res = client.post('/api/checkout/', checkout_payload, format='json')
    assert order_res.status_code == 201, f"Checkout failed: {order_res.content}"
    order_data = order_res.json()
    order_number = order_data['order_number']
    print(f"✓ Order created: #{order_number}")

    # Verify Order state in DB
    order = Order.objects.get(order_number=order_number)
    assert order.status == 'waiting_for_payment', f"Expected waiting_for_payment, got {order.status}"
    assert order.payment_status == 'pending', f"Expected pending payment status, got {order.payment_status}"
    assert order.total_amount == 290.00  # (120 * 2) + 50 shipping
    print(f"✓ Order verified in DB: Status='{order.status}', PaymentStatus='{order.payment_status}', Total={order.total_amount} EGP")

    # Verify Stock Deduction
    prod.refresh_from_db()
    assert prod.stock_quantity == initial_stock - 2, f"Expected stock {initial_stock - 2}, got {prod.stock_quantity}"
    print(f"✓ Stock deducted correctly: {initial_stock} -> {prod.stock_quantity}")

    # Verify Admin Notification was created for new order
    notif = AdminNotification.objects.filter(related_order_number=order_number, notification_type='new_order').first()
    assert notif is not None, "AdminNotification for new_order was not created"
    print(f"✓ Admin notification recorded: '{notif.title}'")

    # 5. Test Customer Submitting Transfer Screenshot
    print("\n--- Testing Payment Confirmation Submission (Screenshot/Reference) ---")
    confirm_payload = {
        'transfer_amount': 290.00,
        'transfer_reference': 'INSTA-89472619',
        'customer_phone': '01012345678',
        'payment_screenshot': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    }
    confirm_res = client.post(f'/api/orders/{order_number}/payment-confirmation/', confirm_payload, format='json')
    assert confirm_res.status_code in [200, 201], f"Confirmation failed: {confirm_res.content}"
    confirm_data = confirm_res.json()
    assert confirm_data['success'] is True
    print(f"✓ Client submission response: \"{confirm_data['message']}\"")

    # Verify Order is now under payment review
    order.refresh_from_db()
    assert order.status == 'payment_review', f"Expected payment_review, got {order.status}"
    assert order.payment_status == 'waiting_verification', f"Expected waiting_verification, got {order.payment_status}"
    print(f"✓ Order transitioned to: Status='{order.status}', PaymentStatus='{order.payment_status}'")

    # Verify PaymentConfirmation DB record
    conf_record = PaymentConfirmation.objects.filter(order_number=order_number).first()
    assert conf_record is not None, "PaymentConfirmation record not found in DB"
    assert conf_record.verification_status == 'pending'
    assert conf_record.transfer_reference == 'INSTA-89472619'
    print(f"✓ PaymentConfirmation DB record verified: ID={conf_record.id}, Status={conf_record.verification_status}")

    # 6. Test Guard: Admin cannot set order to PREPARING before approving payment!
    print("\n--- Testing Guard: Cannot change to PREPARING while payment is unpaid ---")
    prep_attempt = client.post(f'/api/admin/orders/{order.id}/update_status/', {'status': 'preparing'}, format='json')
    assert prep_attempt.status_code == 400, f"Expected 400 rejection, got {prep_attempt.status_code}"
    print("✓ Successfully blocked: Unpaid order cannot be set to PREPARING!")

    # 7. Test Admin Payment Approval
    print("\n--- Testing Admin Payment Approval ---")
    approve_res = client.post(f'/api/admin/payment-confirmations/{conf_record.id}/approve/', {
        'admin_name': 'Atelier Manager Omar',
        'admin_notes': 'Bank transfer confirmed on InstaPay business feed.'
    }, format='json')
    assert approve_res.status_code == 200, f"Approval failed: {approve_res.content}"

    # Verify DB after approval
    conf_record.refresh_from_db()
    order.refresh_from_db()
    assert conf_record.verification_status == 'approved'
    assert conf_record.payment_status == 'paid'
    assert conf_record.admin_reviewer == 'Atelier Manager Omar'
    assert order.payment_status == 'paid'
    print(f"✓ Payment approved in DB: PaymentStatus='{order.payment_status}', Verification='{conf_record.verification_status}', Reviewer='{conf_record.admin_reviewer}'")

    # 8. Test Status Transition to PREPARING and WhatsApp Invoice generation
    print("\n--- Testing Order Status -> PREPARING (Fulfillment + Invoice) ---")
    prep_res = client.post(f'/api/admin/orders/{order.id}/update_status/', {'status': 'preparing'}, format='json')
    assert prep_res.status_code == 200, f"Preparing failed: {prep_res.content}"
    prep_data = prep_res.json()
    assert 'whatsapp_invoice' in prep_data, "WhatsApp invoice was not generated on PREPARING status change!"
    print("✓ WhatsApp preparation invoice automatically generated:")
    print("--------------------------------------------------")
    print(prep_data['whatsapp_invoice'][:250] + "...")
    print("--------------------------------------------------")

    # 9. Test Rejection Workflow on another order
    print("\n--- Testing Payment Rejection Workflow ---")
    order2_res = client.post('/api/checkout/', {
        'customer_name': 'Tarek Mostafa',
        'customer_email': 'tarek@example.com',
        'customer_phone': '01122334455',
        'shipping_address': 'Maadi, Cairo',
        'governorate': 'Cairo',
        'payment_method': 'instapay',
        'items': [{'product_id': prod.id, 'quantity': 1, 'price': 120.00}]
    }, format='json')
    order2_num = order2_res.json()['order_number']
    client.post(f'/api/orders/{order2_num}/payment-confirmation/', {
        'transfer_amount': 50.00, # Wrong amount
        'transfer_reference': 'BAD-REF-001'
    }, format='json')
    conf2 = PaymentConfirmation.objects.get(order_number=order2_num)

    reject_res = client.post(f'/api/admin/payment-confirmations/{conf2.id}/reject/', {
        'reason': 'Transfer amount (50 EGP) does not match total payable (170 EGP).',
        'admin_name': 'Supervisor Salma'
    }, format='json')
    assert reject_res.status_code == 200

    conf2.refresh_from_db()
    order2 = Order.objects.get(order_number=order2_num)
    assert conf2.verification_status == 'rejected'
    assert conf2.payment_status == 'rejected'
    assert order2.payment_status == 'rejected'
    assert order2.status == 'payment_rejected'
    assert 'whatsapp_notification' in reject_res.json()
    print(f"✓ Rejection workflow verified: Status='{order2.status}', Reason='{conf2.rejection_reason}'")

    # 10. Test Dashboard Stats (14 Metrics)
    print("\n--- Testing Admin Dashboard Stats (14 Metrics) ---")
    stats_res = client.get('/api/admin/dashboard/stats/')
    assert stats_res.status_code == 200
    stats_data = stats_res.json()
    for metric_name in [
        'today_orders', 'pending_orders', 'waiting_payment_verification',
        'paid_orders', 'preparing_orders', 'shipped_orders', 'delivered_orders',
        'cancelled_orders', 'today_revenue', 'monthly_revenue', 'pending_payments',
        'low_stock_products', 'new_customers', 'new_inquiries'
    ]:
        assert metric_name in stats_data, f"Metric '{metric_name}' missing from dashboard stats!"
    print(f"✓ All 14 production dashboard metrics verified! Monthly revenue: {stats_data['monthly_revenue']} EGP, Paid orders: {stats_data['paid_orders']}")

    # 11. Test Reports API (Weekly/Monthly and CSV export)
    print("\n--- Testing Reports API (JSON and CSV) ---")
    rep_res = client.get('/api/admin/reports/?period=weekly&format=json')
    assert rep_res.status_code == 200
    rep_data = rep_res.json()
    assert 'metrics' in rep_data and 'top_products' in rep_data
    print("✓ Weekly JSON report generated successfully.")

    csv_res = client.get('/api/admin/reports/?period=weekly&format=csv')
    assert csv_res.status_code == 200
    assert csv_res['Content-Type'] == 'text/csv'
    assert b'Report Period' in csv_res.content
    print("✓ CSV export verified successfully!")

    print("\n🎉 ALL 11 PRODUCTION VERIFICATION SUITES PASSED FLAWLESSLY!")

if __name__ == '__main__':
    run_tests()
