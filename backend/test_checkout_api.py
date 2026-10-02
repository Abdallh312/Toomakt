import json
import urllib.request

url = "http://127.0.0.1:8000/api/checkout/"
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

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        print("Status code:", response.status)
        result = json.loads(response.read().decode('utf-8'))
        print("Response:", result)
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code)
    print("Body:", e.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
