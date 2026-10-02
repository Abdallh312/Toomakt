from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from store.models import (
    Flavor,
    Category,
    Product,
    ProductVariant,
    ProductMedia,
    Bundle,
    Review,
    Coupon,
    Order,
    OrderItem,
    HomepageSection,
    CMSPage,
    GlobalSetting
)


class Command(BaseCommand):
    help = 'Seeds initial toomakt production store with flavors, CMS, settings, and products'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Seeding toomakt complete e-commerce ecosystem...'))

        # 0. Admin user
        admin_user, created = User.objects.get_or_create(
            username='admin@toomakt.com',
            defaults={
                'email': 'admin@toomakt.com',
                'first_name': 'Atelier',
                'last_name': 'Director',
                'is_staff': True,
                'is_superuser': True
            }
        )
        admin_user.set_password('admin123456')
        admin_user.save()

        # 1. Flavors
        flavors_data = [
            {'name': 'Wild Strawberry', 'slug': 'strawberry', 'color': '#C2293E', 'secondary_color': '#FDF0F2', 'description': 'Hand-picked Alpine berries simmered in pure copper kettles.'},
            {'name': 'Alphonso Mango', 'slug': 'mango', 'color': '#E58B12', 'secondary_color': '#FEF7EC', 'description': 'Equatorial sunshine and golden honeycomb notes.'},
            {'name': 'Nordic Bilberry', 'slug': 'blueberry', 'color': '#3B3868', 'secondary_color': '#F2F2FC', 'description': 'Midnight sun arctic bilberries with lavender notes.'},
            {'name': 'Sicilian Blood Orange', 'slug': 'citrus', 'color': '#D65A20', 'secondary_color': '#FEF3EC', 'description': 'Sun-drenched citrus zest against rich browned butter.'},
            {'name': 'Granny Smith Apple', 'slug': 'apple', 'color': '#7B8838', 'secondary_color': '#F4F7EB', 'description': 'Crisp orchard tartness with honeyed butterscotch.'},
        ]
        flavor_objs = {}
        for fd in flavors_data:
            f, _ = Flavor.objects.update_or_create(slug=fd['slug'], defaults=fd)
            flavor_objs[fd['slug']] = f

        # 2. Categories
        Category.objects.all().delete()
        cats_data = [
            {'name': 'All', 'slug': 'all', 'display_order': 0, 'description': 'Full artisanal confection portfolio.'},
            {'name': 'Mango', 'slug': 'mango', 'display_order': 1, 'description': 'Artisanal sun-ripened Alphonso mango fruit toffees.'},
            {'name': 'Berry', 'slug': 'berry', 'display_order': 2, 'description': 'Wild alpine strawberries, mountain raspberries and cream.'},
            {'name': 'Citrus', 'slug': 'citrus', 'display_order': 3, 'description': 'Cold-pressed Mediterranean lemons, limes and blood orange.'},
            {'name': 'Gift boxes', 'slug': 'gift-boxes', 'display_order': 4, 'description': 'Luxury presentation boxes and artisan reserve collections.'},
        ]
        cat_objs = {}
        for cd in cats_data:
            c, _ = Category.objects.update_or_create(slug=cd['slug'], defaults=cd)
            cat_objs[cd['slug']] = c

        # 3. Products — Clear old products first
        Product.objects.all().delete()
        prods = [
            {
                'name': 'Mango Sunbeam',
                'slug': 'mango-sunbeam',
                'sku': 'TMK-MNG-001',
                'category': cat_objs['mango'],
                'flavor': flavor_objs['mango'],
                'tagline': 'Creamy, bright, buttery finish.',
                'description': 'Pure Alphonso mango purée slow-simmered with Normandy sweet cream butter into an explosive sunny chew.',
                'price': Decimal('260.00'),
                'compare_at_price': Decimal('290.00'),
                'weight': '250g Pouch',
                'badge': 'BEST SELLER',
                'badge_type': 'gold',
                'accent_color': '#FFD147',
                'light_bg_color': '#FFFDF5',
                'image_url': '/images/products/mango_sunbeam.jpg',
                'chewiness': Decimal('9.8'),
                'fruit_impact_label': 'Fruit Density',
                'fruit_impact_score': Decimal('9.9'),
                'fruit_notes': ['Alphonso Mango Purée', 'Normandy Sweet Butter', 'Tahitian Vanilla', 'Citrus Zing'],
                'ingredients': ['Alphonso mango purée', 'Grass-fed butter (84% butterfat)', 'Cane sugar', 'Maldon sea salt flakes'],
                'is_featured': True,
                'is_best_seller': True,
                'stock_quantity': 85
            },
            {
                'name': 'Berry Afterglow',
                'slug': 'berry-afterglow',
                'sku': 'TMK-BRY-002',
                'category': cat_objs['berry'],
                'flavor': flavor_objs['strawberry'],
                'tagline': 'Layered berries, delicate cream.',
                'description': 'Cold-macerated wild alpine strawberries, raspberries, and dark forest berries swirling in velvety cultured sweet cream.',
                'price': Decimal('220.00'),
                'compare_at_price': Decimal('250.00'),
                'weight': '250g Pouch',
                'badge': 'POPULAR',
                'badge_type': 'berry',
                'accent_color': '#C84B5B',
                'light_bg_color': '#FFF8F9',
                'image_url': '/images/products/berry_afterglow.jpg',
                'chewiness': Decimal('10.0'),
                'fruit_impact_label': 'Berry Burst',
                'fruit_impact_score': Decimal('9.9'),
                'fruit_notes': ['Wild Alpine Strawberries', 'Tart Forest Raspberries', 'Cultured European Cream'],
                'ingredients': ['Alpine strawberry reduction', 'Wild raspberry puree', 'Cultured cream', 'Slow-cooked caramel'],
                'is_featured': True,
                'is_best_seller': True,
                'stock_quantity': 60
            },
            {
                'name': 'Citrus Comet',
                'slug': 'citrus-comet',
                'sku': 'TMK-CTR-003',
                'category': cat_objs['citrus'],
                'flavor': flavor_objs['citrus'],
                'tagline': 'Bright citrus, sparkling acidity.',
                'description': 'A dazzling spark of cold-pressed Mediterranean lemons, sun-warmed limes, and slow-churned butter toffee.',
                'price': Decimal('210.00'),
                'compare_at_price': Decimal('240.00'),
                'weight': '250g Pouch',
                'badge': 'FRESH PICK',
                'badge_type': 'limited',
                'accent_color': '#88C057',
                'light_bg_color': '#F7FCF2',
                'image_url': '/images/products/citrus_comet.jpg',
                'chewiness': Decimal('9.6'),
                'fruit_impact_label': 'Citrus Spark',
                'fruit_impact_score': Decimal('9.8'),
                'fruit_notes': ['Sicilian Lemon Zest', 'Mediterranean Lime Purée', 'Whipped Sweet Butter'],
                'ingredients': ['Cold-pressed lemon oil', 'Lime purée', 'Browned butter toffee', 'Sea salt'],
                'is_featured': True,
                'is_new_arrival': True,
                'stock_quantity': 95
            },
            {
                'name': 'Sun Chaser Box',
                'slug': 'sun-chaser-box',
                'sku': 'TMK-GFT-004',
                'category': cat_objs['gift-boxes'],
                'flavor': flavor_objs['mango'],
                'tagline': 'A bright gathering of fruit-forward favorites.',
                'description': 'A curated deluxe gift collection featuring our finest fruit toffees in a keepsake gold-embossed presentation box.',
                'price': Decimal('1190.00'),
                'compare_at_price': Decimal('1350.00'),
                'weight': '1000g Deluxe Box',
                'badge': 'DELUXE BOX',
                'badge_type': 'gold',
                'accent_color': '#D4AF37',
                'light_bg_color': '#FCFAF2',
                'image_url': '/images/products/sun_chaser_box.jpg',
                'chewiness': Decimal('9.8'),
                'fruit_impact_label': 'Full Spectrum',
                'fruit_impact_score': Decimal('10.0'),
                'fruit_notes': ['Mango Sunbeam', 'Berry Afterglow', 'Citrus Comet', 'Pecan Toffee'],
                'ingredients': ['Assorted fruit purées', 'European butter', 'Cane sugar', 'Madagascar vanilla'],
                'is_featured': True,
                'stock_quantity': 40
            },
            {
                'name': 'Orchard Reserve',
                'slug': 'orchard-reserve',
                'sku': 'TMK-GFT-005',
                'category': cat_objs['gift-boxes'],
                'flavor': flavor_objs['apple'],
                'tagline': 'Deep stone fruit, crisp caramel nuance.',
                'description': 'Hand-selected autumn orchard plums, apricots, and caramelized honey cream in an artisan wooden keepsake box.',
                'price': Decimal('820.00'),
                'compare_at_price': Decimal('950.00'),
                'weight': '750g Keepsake Box',
                'badge': 'ARTISAN RESERVE',
                'badge_type': 'primary',
                'accent_color': '#8D6E63',
                'light_bg_color': '#FBF8F5',
                'image_url': '/images/products/orchard_reserve.jpg',
                'chewiness': Decimal('9.7'),
                'fruit_impact_label': 'Rich Orchard',
                'fruit_impact_score': Decimal('9.9'),
                'fruit_notes': ['Sun-Dried Apricots', 'Spiced Damson Plum', 'Wild Clover Honey Butter'],
                'ingredients': ['Dried apricot concentrate', 'Plum puree', 'Clover honey', 'Cultured butter'],
                'is_featured': False,
                'stock_quantity': 35
            },
            {
                'name': 'Evening Citrus',
                'slug': 'evening-citrus',
                'sku': 'TMK-CTR-006',
                'category': cat_objs['citrus'],
                'flavor': flavor_objs['citrus'],
                'tagline': 'Blood orange, bergamot, dark molasses.',
                'description': 'Late-harvest Sicilian blood orange and floral bergamot infused with golden clover honey and browned butter toffee.',
                'price': Decimal('310.00'),
                'compare_at_price': Decimal('360.00'),
                'weight': '250g Pouch',
                'badge': 'LIMITED EDITION',
                'badge_type': 'limited',
                'accent_color': '#D35400',
                'light_bg_color': '#FDF6F0',
                'image_url': '/images/products/evening_citrus.jpg',
                'chewiness': Decimal('9.8'),
                'fruit_impact_label': 'Dark Citrus',
                'fruit_impact_score': Decimal('9.9'),
                'fruit_notes': ['Sicilian Blood Orange', 'Calabrian Bergamot', 'Raw Cane Molasses'],
                'ingredients': ['Blood orange reduction', 'Bergamot essence', 'Dark cane sugar', 'French butter'],
                'is_featured': False,
                'stock_quantity': 50
            }
        ]

        for p_data in prods:
            prod, _ = Product.objects.update_or_create(slug=p_data['slug'], defaults=p_data)
            # Variants
            ProductVariant.objects.update_or_create(
                product=prod, sku=f"{prod.sku}-250G",
                defaults={'title': prod.weight, 'price': prod.price, 'weight': prod.weight, 'stock_quantity': prod.stock_quantity}
            )
            ProductVariant.objects.update_or_create(
                product=prod, sku=f"{prod.sku}-350G",
                defaults={'title': '350g Double Pouch', 'price': prod.price * Decimal('1.85'), 'weight': '350g', 'stock_quantity': 30}
            )

        # 4. Bundles
        bundles_data = [
            {
                'title': 'The Grand Fruit & Toffee Carousel',
                'slug': 'the-grand-fruit-toffee-carousel',
                'category': 'CONFECTION OF THE YEAR',
                'badge': '94% of first-time buyers select this',
                'description': "Our bespoke gilded collector's canister packed with all 12 artisanal fruit-marbled toffee chews. Individually wrapped in high-gloss foil with ribbon closure.",
                'price': Decimal('42.00'),
                'weight': '450G LUXURY TIN',
                'rating': Decimal('4.98'),
                'review_count': 1280,
                'image_url': '/images/carousel.jpg',
                'perk_note': 'Includes Gold Foil Gift Bag & Tasting Menu',
                'is_grand_feature': True
            },
            {
                'title': 'Artisan Pulled Berry Swirls',
                'slug': 'artisan-pulled-berry-swirls',
                'category': 'Tasting Trio',
                'description': 'Triple-folded blackberry, raspberry & blueberry golden toffee squares in a commemorative wooden slide-box.',
                'price': Decimal('18.00'),
                'weight': '220g Box',
                'rating': Decimal('5.00'),
                'review_count': 420,
                'image_url': '/images/chew_sample.jpg',
                'is_grand_feature': False
            },
            {
                'title': 'Summer Tropical Duo',
                'slug': 'summer-tropical-duo',
                'category': 'Limited Edition • Only 140 Bundles Left',
                'description': 'Mango Zing + Passionfruit Blossom twin pouches in signature gold zip closure.',
                'price': Decimal('32.00'),
                'weight': '2 x 180g Pouches',
                'rating': Decimal('4.94'),
                'review_count': 260,
                'image_url': '/images/marbling.jpg',
                'is_grand_feature': False
            },
            {
                'title': 'Pocket Chews 6-Pack',
                'slug': 'pocket-chews-6-pack',
                'category': 'Pocket Tins • Perfect for Gifting',
                'description': 'Individually sealed purse-ready slider tins. One of each core harvest recipe.',
                'price': Decimal('24.00'),
                'weight': '6 x 40g Tins',
                'rating': Decimal('4.97'),
                'review_count': 512,
                'image_url': '/images/canister.jpg',
                'is_grand_feature': False
            }
        ]
        for b in bundles_data:
            Bundle.objects.update_or_create(slug=b['slug'], defaults=b)

        # 5. Reviews
        reviews_data = [
            {
                'author': 'Camilla Montgomery',
                'location': 'Austin, TX',
                'role': 'Verified Collector',
                'rating': 5,
                'title': '“Ruined all normal candy for me.”',
                'content': 'The real fruit swirl is completely unreal. You can actually taste real strawberry seeds and that heavy slow-cooked European butter. My entire studio ordered a box the next morning.',
                'product_tag': 'Strawberry Burst',
                'status': 'approved',
                'is_verified': True,
                'is_featured': True
            },
            {
                'author': 'Julian Levesque',
                'location': 'Brooklyn, NY',
                'role': 'Verified Confectioner',
                'rating': 5,
                'title': '“The packaging alone is museum grade.”',
                'content': 'The luxury cylinder canister feels like something you’d purchase at an exclusive Parisian boutique. The toffee is velvety, stretchy without being gummy, and the Mango Zing is pure culinary joy.',
                'product_tag': 'The Grand Tin',
                'status': 'approved',
                'is_verified': True,
                'is_featured': True
            },
            {
                'author': 'Sarah Al-Mansoor',
                'location': 'Seattle, WA',
                'role': 'Verified Buyer',
                'rating': 5,
                'title': '“Addictive texture and real fruit notes.”',
                'content': 'You don’t get that chemical back-taste typical to chewy candies. It feels like biting into sweet orchard preserves enveloped in toasted golden caramel. Ordered four more bags for summer gifting.',
                'product_tag': 'Blueberry Velvet',
                'status': 'approved',
                'is_verified': True,
                'is_featured': True
            }
        ]
        for r in reviews_data:
            Review.objects.update_or_create(author=r['author'], defaults=r)

        # 6. Coupons
        Coupon.objects.update_or_create(
            code='TOOMAKT10',
            defaults={'discount_type': 'percentage', 'discount_value': Decimal('10.00'), 'is_active': True}
        )
        Coupon.objects.update_or_create(
            code='SWEET10',
            defaults={'discount_type': 'percentage', 'discount_value': Decimal('10.00'), 'is_active': True}
        )
        Coupon.objects.update_or_create(
            code='SUMMER15',
            defaults={'discount_type': 'percentage', 'discount_value': Decimal('15.00'), 'min_order_amount': Decimal('40.00'), 'is_active': True}
        )

        # 7. Homepage Sections (CMS)
        sections = [
            {
                'section_key': 'hero',
                'title': 'Hero Showcase',
                'subtitle': 'Big Fruit. Real Toffee. Pure Obsession.',
                'display_order': 1,
                'is_active': True,
                'content': {
                    'badge': 'Limited Summer Batch No. 08 • Gold Medal Confiserie 2024',
                    'heading': 'BIG FRUIT. REAL TOFFEE.',
                    'highlight': 'PURE OBSESSION.',
                    'subtext': 'Artisanal slow-cooked golden caramel infused with sun-ripened real fruit purées. Chewy, luscious, and unforgettable.',
                    'primary_btn': 'SHOP THE HARVEST BOX',
                    'secondary_btn': 'EXPLORE 12 FLAVORS'
                }
            },
            {
                'section_key': 'flavor_vault',
                'title': 'The Flavor Vault',
                'subtitle': 'The Confection Palette',
                'display_order': 2,
                'is_active': True,
                'content': {
                    'description': 'Each flavor begins with orchard-ripened fruit purée, swirled gently into hand-pulled golden dairy toffee.'
                }
            },
            {
                'section_key': 'crowd_favorites',
                'title': 'The Crowd Favorites',
                'subtitle': 'Curated Gift Boxes & Bundles',
                'display_order': 3,
                'is_active': True,
                'content': {
                    'proof_badge': '94% of first-time buyers select the Grand Carousel Box'
                }
            },
            {
                'section_key': 'anatomy',
                'title': 'The Anatomy of a toomakt Chew',
                'subtitle': 'Farm to Kettle Perfection',
                'display_order': 4,
                'is_active': True,
                'content': {
                    'subtext': 'Ordinary candy relies on high-fructose corn syrup and synthetic flavoring. We make toffee the way French confiseurs did 120 years ago.'
                }
            },
            {
                'section_key': 'testimonials',
                'title': 'Unboxing Obsessions',
                'subtitle': 'Community Love',
                'display_order': 5,
                'is_active': True,
                'content': {
                    'satisfaction_badge': 'Verified Buyer Satisfaction 98.7%'
                }
            },
            {
                'section_key': 'starter_perk',
                'title': 'Sweet Starter Perk',
                'subtitle': 'Unlock 10% Off + Free Mango Chew Pouch',
                'display_order': 6,
                'is_active': True,
                'content': {
                    'subtext': 'Join our tasting circle and receive a complimentary 100g sample in your first dispatch.'
                }
            }
        ]
        for sec in sections:
            HomepageSection.objects.update_or_create(section_key=sec['section_key'], defaults=sec)

        # 8. CMS Pages
        pages = [
            {
                'title': 'Our Confectionery Story',
                'slug': 'story',
                'visibility': 'published',
                'seo_title': 'The toomakt Atelier Story — 120 Years of French Confiserie Tradition',
                'seo_description': 'Discover how toomakt reinvents fruit toffee with copper kettle boiling and pure fruit purées.',
                'content': "In a sunlit workshop in Normandy, our confiseurs gently fold peak-harvest fruit purée into slow-bubbling golden caramel. We believe toffee should never be synthetic, gummy, or aggressive. It should soften on your tongue, release a rush of fragrant berry or mango acid, and finish with flaky Maldon crystals."
            },
            {
                'title': 'Ingredients & Botanical Quality',
                'slug': 'ingredients',
                'visibility': 'published',
                'seo_title': 'Purity First: 100% Real Fruit, 84% Butterfat Dairy, Zero Synthetic Colors',
                'seo_description': 'Every single ingredient in a toomakt chew is traceable, natural, and non-GMO verified.',
                'content': "We exclusively source Alpine Mara des Bois strawberries, Ratnagiri Alphonso mangoes, and Nordic bilberries. Our dairy comes from pasture-grazed Normandy cows producing rich cultured butter with 84% butterfat. Preserved strictly through cane sugar caramelization without artificial preservatives."
            },
            {
                'title': 'Frequently Asked Questions',
                'slug': 'faq',
                'visibility': 'published',
                'seo_title': 'toomakt FAQ: Shipping, Shelf-Life, Storage, and Ingredients',
                'seo_description': 'Find answers about our shipping liners, allergen info, and temperature care.',
                'content': "Q: Does your toffee stick to teeth?\nA: No! Because we boil at 240°F with cultured high-butterfat cream, our chew melts with body heat.\n\nQ: How do you ship in warm weather?\nA: Every parcel is dispatched with plant-based insulated thermal liners and non-toxic chill packs.\n\nQ: Is toomakt gluten-free?\nA: Yes, all our recipe formulas are naturally gluten-free and non-GMO."
            },
            {
                'title': 'Insulated Cooler Shipping & Guarantee',
                'slug': 'shipping',
                'visibility': 'published',
                'seo_title': 'Cold-Chain Express Shipping & Sweet Melt Guarantee',
                'seo_description': 'Free express shipping on orders over $45 with thermal protection.',
                'content': "We guarantee your toffees arrive in flawless artisan condition. If your parcel ever encounters transit heat or damage, our Sweet Melt Guarantee immediately sends a fresh batch free of charge."
            }
        ]
        for p in pages:
            CMSPage.objects.update_or_create(slug=p['slug'], defaults=p)

        # 9. Global Settings
        settings_map = {
            'brand_name': 'toomakt',
            'brand_tagline': 'FRUIT & TOFFEE CONFECTIONERY',
            'support_email': 'bonjour@toomakt.com',
            'support_phone': '+1 (800) 555-TOOMAKT',
            'address': '18 Rue de la Confiserie, 14000 Caen, France & Brooklyn, NY',
            'currency': 'USD',
            'currency_symbol': '$',
            'free_shipping_threshold': 45.00,
            'standard_shipping_fee': 4.99,
            'tax_rate_percent': 5.0,
            'social_instagram': 'https://instagram.com/toomakt',
            'social_tiktok': 'https://tiktok.com/@toomakt',
            'seo_site_title': 'toomakt — Big Fruit. Real Toffee. Pure Obsession.',
            'seo_meta_description': 'Handcrafted artisanal fruit toffee confections infused with 100% natural fruit purées and European cultured butter.',
            'seo_og_image': '/images/canister.jpg'
        }
        for k, v in settings_map.items():
            GlobalSetting.objects.update_or_create(key=k, defaults={'value': v, 'category': 'general'})

        # 10. Sample Orders
        sample_order = Order.objects.filter(order_number='TMK-892411').first()
        if not sample_order:
            ord_obj = Order.objects.create(
                order_number='TMK-892411',
                customer_name='Camilla Montgomery',
                customer_email='camilla@example.com',
                customer_phone='+1 512-555-0199',
                shipping_address='742 Evergreen Terrace, Austin, TX 78701',
                shipping_city='Austin',
                shipping_country='United States',
                subtotal=Decimal('44.00'),
                discount_amount=Decimal('4.40'),
                shipping_fee=Decimal('0.00'),
                tax_amount=Decimal('1.98'),
                total_amount=Decimal('41.58'),
                promo_code='TOOMAKT10',
                payment_method='card',
                payment_status='paid',
                status='shipped',
                tracking_number='TMK-EXP-948190',
                timeline=[
                    {'time': (timezone.now() - timezone.timedelta(days=2)).isoformat(), 'title': 'Order Placed', 'desc': 'Customer checked out with Express Cooler Shipping.'},
                    {'time': (timezone.now() - timezone.timedelta(days=1)).isoformat(), 'title': 'Hand-Pulled in Atelier', 'desc': 'Fresh batch pulled and gilded in foil.'},
                    {'time': timezone.now().isoformat(), 'title': 'Dispatched via Cooler Freight', 'desc': 'Tracking TMK-EXP-948190'}
                ]
            )
            OrderItem.objects.create(
                order=ord_obj, name='The Summer Fruit Canister', item_id='the-summer-fruit-canister',
                sku='TMK-CAN-001', unit_price=Decimal('28.00'), quantity=1, total_price=Decimal('28.00'), image_url='/images/canister.jpg'
            )
            OrderItem.objects.create(
                order=ord_obj, name='Strawberry Burst (180g)', item_id='strawberry-burst',
                sku='TMK-BRY-002', unit_price=Decimal('16.00'), quantity=1, total_price=Decimal('16.00'), image_url='/images/chew_sample.jpg'
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded toomakt full production ecosystem!'))
