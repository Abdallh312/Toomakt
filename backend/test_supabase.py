import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SECRET_KEY')

print(f"Connecting to Supabase at: {url}")
client = create_client(url, key)

try:
    res = client.table('toomakt_products').select('name, price, stock_quantity, in_stock').execute()
    print(f"SUCCESS! Connected to Supabase PostgreSQL database.")
    print(f"Total products fetched from Supabase: {len(res.data)}")
    for p in res.data:
        print(f" - {p.get('name')}: ${p.get('price')} (Stock: {p.get('stock_quantity')}, In Stock: {p.get('in_stock')})")
except Exception as e:
    print(f"Error querying Supabase: {e}")
