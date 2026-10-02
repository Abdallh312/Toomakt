import os
import sys
import django

sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'toomakt_backend.settings')
django.setup()

from store.models import GlobalSetting

settings_to_seed = [
    {
        'category': 'payments',
        'key': 'instapay_settings',
        'label': 'InstaPay Payment Details',
        'value': {
            'address': 'toomakt@instapay',
            'account_name': 'toomakt Confectionery',
            'phone': '01000000000',
            'bank_name': 'CIB Egypt',
            'instructions': 'Transfer the exact order total via the InstaPay mobile app, then send a screenshot of the transaction receipt.'
        }
    },
    {
        'category': 'messaging',
        'key': 'whatsapp_settings',
        'label': 'WhatsApp Business & Support',
        'value': {
            'phone': '201000000000',
            'business_name': 'toomakt Atelier',
            'auto_invoice_on_preparing': True
        }
    },
    {
        'category': 'shipping',
        'key': 'shipping_rules',
        'label': 'Shipping & Delivery Configuration',
        'value': {
            'default_fee': 50.0,
            'free_shipping_threshold': 500.0,
            'is_free_shipping_enabled': True
        }
    },
    {
        'category': 'analytics',
        'key': 'tracking_pixels',
        'label': 'Tracking Pixels & Analytics',
        'value': {
            'meta_pixel_id': '',
            'google_analytics_id': '',
            'google_tag_manager_id': '',
            'enabled': True
        }
    },
    {
        'category': 'seo',
        'key': 'seo_global',
        'label': 'Global SEO Settings',
        'value': {
            'site_name': 'toomakt Confectionery',
            'title_template': '%s | toomakt Egypt',
            'meta_description': 'Handcrafted French fruit-marbled toffee confections pulled in copper kettles.',
            'og_image': '/images/canister.jpg'
        }
    }
]

for s in settings_to_seed:
    obj, created = GlobalSetting.objects.get_or_create(key=s['key'], defaults=s)
    if not created and not obj.value:
        obj.value = s['value']
        obj.save()
    status_str = 'CREATED' if created else 'EXISTS'
    print(f"Setting {s['key']}: {status_str}")
