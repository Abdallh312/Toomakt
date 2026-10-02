import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'toomakt_backend.settings')
django.setup()

from store.models import Product, Order, OrderItem, Coupon, ShippingRate
from django.db import transaction
from django.db.models import F

p = Product.objects.first()
print("Product:", p.name, "Stock:", p.stock_quantity)

try:
    with transaction.atomic():
        # Test update
        Product.objects.filter(id=p.id).update(stock_quantity=F('stock_quantity') - 1)
        p.refresh_from_db()
        print("Refreshed stock:", p.stock_quantity)
        p.save()
        print("Save succeeded!")
except Exception as e:
    import traceback
    traceback.print_exc()
