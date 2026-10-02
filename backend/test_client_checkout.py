import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'toomakt_backend.settings')
django.setup()

from rest_framework.test import APIClient

client = APIClient()
payload = {
    "customer_name": "Test Gourmet Buyer",
    "customer_email": "taster@toomakt.com",
    "customer_phone": "+20 100 123 4567",
    "shipping_address": "15 Nile Corniche, Zamalek",
    "shipping_city": "Cairo",
    "governorate": "Cairo",
    "shipping_country": "Egypt",
    "payment_method": "cod",
    "items": [
        {
            "item_id": "mango-zing",
            "name": "Mango Zing",
            "unit_price": 16.00,
            "quantity": 2,
            "total_price": 32.00
        }
    ]
}

response = client.post('/api/checkout/', payload, format='json')
print("Status:", response.status_code)
print("Data:", response.data if hasattr(response, 'data') else response.content)
