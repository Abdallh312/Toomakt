import os
import sys
import unittest
from decimal import Decimal

# Set up Django environment
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'toomakt_backend.settings')

import django
django.setup()

from store.models import Order, Product, TelegramAdminUser
from store.telegram_service import handle_telegram_update, _send_telegram_raw

# Intercept sent telegram messages for verification
SENT_MESSAGES = []

def mock_send_telegram(token, chat_id, text, reply_markup=None):
    SENT_MESSAGES.append({
        'chat_id': str(chat_id),
        'text': text,
        'reply_markup': reply_markup
    })
    return True

# Monkey patch _send_telegram_raw and _answer_callback_query
import store.telegram_service
store.telegram_service._send_telegram_raw = mock_send_telegram
store.telegram_service._answer_callback_query = lambda token, qid, text=None, show_alert=False: True

class TestTelegramBotCommands(unittest.TestCase):

    def setUp(self):
        SENT_MESSAGES.clear()

        # Clean up transient test admin records
        TelegramAdminUser.objects.filter(telegram_id__in=['555666777', '111222333', '444333222', '123456789']).delete()

        # Create or ensure test admin
        self.admin_id = '999888777'
        self.master_id = '1686960840'
        TelegramAdminUser.objects.update_or_create(
            telegram_id=self.admin_id,
            defaults={
                'first_name': 'Test Admin',
                'role': 'atelier_manager',
                'is_active': True,
                'can_receive_alerts': True,
                'can_manage_orders': True
            }
        )

        # Create or ensure test product
        self.product, _ = Product.objects.update_or_create(
            slug='berry-afterglow-test',
            defaults={
                'name': 'Berry Afterglow Test',
                'sku': 'TMK-BERRY-TEST',
                'price': Decimal('220.00'),
                'stock_quantity': 50,
                'box_quantity': 10,
                'box_quantity_label': '10 Boxes / Carton',
                'pack_quantity': '250g Pouch',
                'weight': '250g',
                'tasting_notes': ['Wild Alpine Strawberries', 'Tart Forest Raspberries', 'Cultured European Cream'],
                'in_stock': True,
                'status': 'published'
            }
        )

        # Create or ensure test order
        self.order, _ = Order.objects.update_or_create(
            order_number='ORD-TEST-999',
            defaults={
                'customer_name': 'Sarah Connor',
                'customer_phone': '01012345678',
                'customer_email': 'sarah@example.com',
                'governorate': 'Cairo',
                'shipping_city': 'Zamalek',
                'shipping_address': '15 Gezira St.',
                'subtotal': Decimal('220.00'),
                'shipping_fee': Decimal('50.00'),
                'total_amount': Decimal('270.00'),
                'payment_method': 'instapay',
                'status': 'pending'
            }
        )

    def test_01_unauthorized_user_denied(self):
        """Unauthorized user should be rejected unless they use /auth"""
        unauthed_id = '111222333'
        update = {
            'message': {
                'from': {'id': unauthed_id, 'first_name': 'Stranger'},
                'chat': {'id': unauthed_id},
                'text': '/orders'
            }
        }
        handle_telegram_update(update)
        user_msgs = [m['text'] for m in SENT_MESSAGES if m['chat_id'] == unauthed_id]
        self.assertTrue(len(user_msgs) >= 1)
        self.assertIn("غير مصرح له بالوصول", user_msgs[0])

    def test_02_auth_command_success(self):
        """User can authenticate with valid secret code"""
        unauthed_id = '555666777'
        update = {
            'message': {
                'from': {'id': unauthed_id, 'first_name': 'New Manager'},
                'chat': {'id': unauthed_id},
                'text': '/auth toomakt2026'
            }
        }
        handle_telegram_update(update)
        user_msgs = [m['text'] for m in SENT_MESSAGES if m['chat_id'] == unauthed_id]
        self.assertTrue(len(user_msgs) >= 1)
        self.assertIn("تم التوثيق والاعتماد بنجاح", user_msgs[0])
        self.assertTrue(TelegramAdminUser.objects.filter(telegram_id=unauthed_id, is_active=True).exists())

    def test_03_auth_command_invalid_code(self):
        """Invalid secret code should be rejected"""
        update = {
            'message': {
                'from': {'id': '444333222', 'first_name': 'Hacker'},
                'chat': {'id': '444333222'},
                'text': '/auth wrongpassword'
            }
        }
        handle_telegram_update(update)
        last_msg = SENT_MESSAGES[-1]['text']
        self.assertIn("رمز الاعتماد غير صحيح", last_msg)

    def test_04_help_and_start_command(self):
        """Test /start or /help returns comprehensive admin menu"""
        update = {
            'message': {
                'from': {'id': self.admin_id, 'first_name': 'Test Admin'},
                'chat': {'id': self.admin_id},
                'text': '/help'
            }
        }
        handle_telegram_update(update)
        last_msg = SENT_MESSAGES[-1]['text']
        self.assertIn("لوحة تحكم معمل toomakt", last_msg)
        self.assertIn("/orders", last_msg)
        self.assertIn("/products", last_msg)

    def test_05_orders_command(self):
        """Test /orders lists active orders"""
        update = {
            'message': {
                'from': {'id': self.admin_id, 'first_name': 'Test Admin'},
                'chat': {'id': self.admin_id},
                'text': '/orders'
            }
        }
        handle_telegram_update(update)
        last_msg = SENT_MESSAGES[-1]['text']
        self.assertIn("أحدث الطلبات", last_msg)
        self.assertIn("ORD-TEST-999", last_msg)

    def test_06_order_detail_command(self):
        """Test /order ORD-TEST-999 returns full details"""
        update = {
            'message': {
                'from': {'id': self.admin_id, 'first_name': 'Test Admin'},
                'chat': {'id': self.admin_id},
                'text': '/order ORD-TEST-999'
            }
        }
        handle_telegram_update(update)
        last_msg = SENT_MESSAGES[-1]['text']
        self.assertIn("ORD-TEST-999", last_msg)
        self.assertIn("Sarah Connor", last_msg)
        self.assertIn("270.00 EGP", last_msg)

    def test_07_products_command(self):
        """Test /products lists all registered confections"""
        update = {
            'message': {
                'from': {'id': self.admin_id, 'first_name': 'Test Admin'},
                'chat': {'id': self.admin_id},
                'text': '/products'
            }
        }
        handle_telegram_update(update)
        last_msg = SENT_MESSAGES[-1]['text']
        self.assertIn("قائمة منتجات معمل toomakt", last_msg)
        self.assertIn("Berry Afterglow Test", last_msg)

    def test_08_product_detail_command(self):
        """Test /product <slug> returns structured specifications"""
        update = {
            'message': {
                'from': {'id': self.admin_id, 'first_name': 'Test Admin'},
                'chat': {'id': self.admin_id},
                'text': '/product berry-afterglow-test'
            }
        }
        handle_telegram_update(update)
        last_msg = SENT_MESSAGES[-1]['text']
        self.assertIn("Berry Afterglow Test", last_msg)
        self.assertIn("220.00 EGP", last_msg)
        self.assertIn("10 علب", last_msg)
        self.assertIn("250g Pouch", last_msg)
        self.assertIn("Wild Alpine Strawberries", last_msg)

    def test_09_stock_command_valid(self):
        """Test updating stock via /stock <id> <qty>"""
        update = {
            'message': {
                'from': {'id': self.admin_id, 'first_name': 'Test Admin'},
                'chat': {'id': self.admin_id},
                'text': '/stock berry-afterglow-test 88'
            }
        }
        handle_telegram_update(update)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 88)
        self.assertTrue(self.product.in_stock)
        last_msg = SENT_MESSAGES[-1]['text']
        self.assertIn("تم تحديث المخزون بنجاح", last_msg)
        self.assertIn("88", last_msg)

    def test_10_stock_command_negative_guarded(self):
        """Test negative quantity is rejected with clear error message"""
        update = {
            'message': {
                'from': {'id': self.admin_id, 'first_name': 'Test Admin'},
                'chat': {'id': self.admin_id},
                'text': '/stock berry-afterglow-test -5'
            }
        }
        handle_telegram_update(update)
        last_msg = SENT_MESSAGES[-1]['text']
        self.assertIn("الكمية لا يمكن أن تكون سالبة", last_msg)

    def test_11_stock_command_invalid_number(self):
        """Test non-numeric quantity is rejected"""
        update = {
            'message': {
                'from': {'id': self.admin_id, 'first_name': 'Test Admin'},
                'chat': {'id': self.admin_id},
                'text': '/stock berry-afterglow-test abc'
            }
        }
        handle_telegram_update(update)
        last_msg = SENT_MESSAGES[-1]['text']
        self.assertIn("ليست قيمة رقمية صحيحة", last_msg)

    def test_12_price_command_valid(self):
        """Test updating price via /price <id> <price>"""
        update = {
            'message': {
                'from': {'id': self.admin_id, 'first_name': 'Test Admin'},
                'chat': {'id': self.admin_id},
                'text': '/price berry-afterglow-test 245.50'
            }
        }
        handle_telegram_update(update)
        self.product.refresh_from_db()
        self.assertEqual(self.product.price, Decimal('245.50'))
        last_msg = SENT_MESSAGES[-1]['text']
        self.assertIn("تم تحديث سعر المنتج بنجاح", last_msg)
        self.assertIn("245.50 EGP", last_msg)

    def test_13_stats_command(self):
        """Test /stats reports revenue and status breakdown"""
        update = {
            'message': {
                'from': {'id': self.admin_id, 'first_name': 'Test Admin'},
                'chat': {'id': self.admin_id},
                'text': '/stats'
            }
        }
        handle_telegram_update(update)
        last_msg = SENT_MESSAGES[-1]['text']
        self.assertIn("إحصائيات مبيعات معمل toomakt", last_msg)

    def test_14_callback_query_quick_navigation(self):
        """Test inline button callback query cmd:orders and cmd:stats"""
        update_orders = {
            'callback_query': {
                'id': 'cq_123',
                'from': {'id': self.admin_id, 'first_name': 'Test Admin'},
                'message': {'chat': {'id': self.admin_id}, 'message_id': 101},
                'data': 'cmd:orders'
            }
        }
        handle_telegram_update(update_orders)
        self.assertTrue(any("أحدث الطلبات" in m['text'] for m in SENT_MESSAGES))

    def test_15_command_with_bot_username_mention(self):
        """Test that /orders@ToomaktBot works cleanly without failing"""
        update = {
            'message': {
                'from': {'id': self.admin_id, 'first_name': 'Test Admin'},
                'chat': {'id': self.admin_id},
                'text': '/orders@ToomaktBot'
            }
        }
        handle_telegram_update(update)
        last_msg = SENT_MESSAGES[-1]['text']
        self.assertIn("أحدث الطلبات", last_msg)

if __name__ == '__main__':
    unittest.main()
