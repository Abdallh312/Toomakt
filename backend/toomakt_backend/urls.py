from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse, JsonResponse
from store.models import Product, Category, Flavor, CMSPage

def sitemap_xml(request):
    base_url = request.build_absolute_uri('/')[:-1]
    urls = [
        f"{base_url}/",
        f"{base_url}/shop",
        f"{base_url}/about",
        f"{base_url}/story",
        f"{base_url}/faq",
        f"{base_url}/contact",
        f"{base_url}/shipping",
    ]
    for p in Product.objects.filter(status='published'):
        urls.append(f"{base_url}/product/{p.slug}")
    for c in Category.objects.filter(is_active=True):
        urls.append(f"{base_url}/category/{c.slug}")
    for f in Flavor.objects.filter(is_active=True):
        urls.append(f"{base_url}/flavor/{f.slug}")
    for page in CMSPage.objects.filter(visibility='published'):
        urls.append(f"{base_url}/page/{page.slug}")

    xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        xml.append(f"  <url><loc>{u}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>")
    xml.append('</urlset>')
    return HttpResponse("\n".join(xml), content_type="application/xml")

def robots_txt(request):
    lines = [
        "User-agent: *",
        "Disallow: /admin/",
        "Disallow: /api/admin/",
        "Disallow: /checkout/",
        "Allow: /",
        f"Sitemap: {request.build_absolute_uri('/sitemap.xml')}"
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")

def api_root(request):
    return JsonResponse({
        'brand': 'toomakt — FRUIT & TOFFEE CONFECTIONERY',
        'status': 'online',
        'version': '2.0.0',
        'endpoints': {
            'store_products': '/api/products/',
            'store_flavors': '/api/flavors/',
            'store_categories': '/api/categories/',
            'store_bundles': '/api/bundles/',
            'store_reviews': '/api/reviews/',
            'store_pages': '/api/pages/',
            'store_homepage': '/api/homepage/',
            'store_settings': '/api/settings/',
            'store_checkout': '/api/checkout/',
            'admin_dashboard_stats': '/api/admin/dashboard/stats/',
            'admin_products': '/api/admin/products/',
            'admin_orders': '/api/admin/orders/',
            'admin_homepage_builder': '/api/admin/homepage-sections/',
            'admin_settings': '/api/admin/settings/',
            'sitemap': '/sitemap.xml',
            'robots': '/robots.txt',
            'django_admin': '/admin/',
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/', include('store.urls')),
    path('sitemap.xml', sitemap_xml, name='sitemap'),
    path('robots.txt', robots_txt, name='robots'),
]
