// toomakt Dynamic SEO, Multi-Language & Structured Data (JSON-LD) Engine
// Production-Ready Confectionery Atelier SEO System for Cairo, Egypt

export interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  language?: 'en' | 'ar';
  noindex?: boolean;
  productData?: {
    name: string;
    description: string;
    image: string;
    price: number | string;
    sku?: string;
    inStock: boolean;
    brand?: string;
    category?: string;
    rating?: number;
    reviewCount?: number;
  };
  categoryData?: {
    name: string;
    description: string;
    url: string;
    itemCount?: number;
  };
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
}

const PRODUCTION_DOMAIN = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CANONICAL_DOMAIN) ||
  'https://www.toomakt.com'
).replace(/\/+$/, '');

export const seo = {
  productionDomain: PRODUCTION_DOMAIN,
  defaultImage: '/images/og/toomakt_whatsapp_share.jpg',
  siteNameEn: 'toomakt Confectionery Atelier',
  siteNameAr: 'معمل توماكت للحلويات الفاخرة',

  defaultTitleEn: 'toomakt — Fruit, slowly made. | Artisanal Fruit Toffee Egypt | توماكت',
  defaultTitleAr: 'توماكت — فاكهة طبيعية مطهوة ببطء | أرقى حلوى توفي فرنسية بمصر',

  defaultDescriptionEn: 'toomakt (توماكت) creates artisanal French fruit toffee in Cairo, Egypt. Handcrafted with 100% natural fruit purées, browned butter, and sea salt. Express climate delivery across all 27 Egyptian governorates.',
  defaultDescriptionAr: 'توماكت (toomakt) تصنع أفخر حلوى توفي فرنسية في القاهرة، مصر. مطهوة ببطء في مراجل نحاسية من بيوريه الفاكهة الطبيعية 100% والزبدة الأوروبية الفاخرة. شحن مبرد لجميع محافظات مصر.',

  defaultKeywordsEn: 'toomakt, fruit toffee egypt, artisanal confectionery cairo, luxury toffee egypt, handcrafted caramel egypt, cairo gourmet sweets, natural toffee',
  defaultKeywordsAr: 'توماكت, حلوى توفي, توفي فواكه, حلويات فاخرة مصر, كراميل يدوي القاهرة, شركة الزهرة للحلويات, توفي زبدة طبيعية, بونبون كابتشينو, هدايا راقية مصر',

  /**
   * Resolves a canonical production URL from an absolute or relative path
   */
  getCanonicalUrl(pathOrUrl?: string): string {
    if (!pathOrUrl) return this.productionDomain + '/';
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
      // Normalize domain to production domain
      try {
        const parsed = new URL(pathOrUrl);
        const cleanPath = parsed.pathname.replace(/\/+$/, '') || '/';
        return `${this.productionDomain}${cleanPath === '/' ? '/' : cleanPath}`;
      } catch {
        return pathOrUrl;
      }
    }
    const clean = pathOrUrl.replace(/^\/+/, '').replace(/\/+$/, '');
    return clean ? `${this.productionDomain}/${clean}` : `${this.productionDomain}/`;
  },

  /**
   * Resolves an absolute image URL
   */
  getImageUrl(imagePath?: string): string {
    const img = imagePath || this.defaultImage;
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }
    const clean = img.startsWith('/') ? img : `/${img}`;
    return `${this.productionDomain}${clean}`;
  },

  /**
   * Updates all document meta tags, canonical, hreflang, social tags and JSON-LD
   */
  updateMeta(meta: SEOMetadata) {
    if (typeof document === 'undefined') return;

    const lang = meta.language || (document.documentElement.lang === 'ar' ? 'ar' : 'en');
    const isAr = lang === 'ar';

    // 1. Page Title
    const brandSuffix = isAr ? 'توماكت' : 'toomakt';
    let fullTitle: string;
    if (meta.title) {
      fullTitle = meta.title.includes(brandSuffix) ? meta.title : `${meta.title} | ${brandSuffix}`;
    } else {
      fullTitle = isAr ? this.defaultTitleAr : this.defaultTitleEn;
    }
    document.title = fullTitle;

    // Helper to create/update meta tags
    const setTag = (nameOrProp: string, val: string, isProp = false) => {
      if (!val) return;
      const attr = isProp ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${nameOrProp}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, nameOrProp);
        document.head.appendChild(el);
      }
      el.content = val;
    };

    const desc = meta.description || (isAr ? this.defaultDescriptionAr : this.defaultDescriptionEn);
    const keywords = meta.keywords || (isAr ? this.defaultKeywordsAr : this.defaultKeywordsEn);
    const fullImgUrl = this.getImageUrl(meta.image);
    const canonicalUrl = this.getCanonicalUrl(meta.url);
    const siteName = isAr ? this.siteNameAr : this.siteNameEn;

    // Standard HTML meta
    setTag('description', desc);
    setTag('keywords', keywords);
    setTag('author', 'toomakt Atelier Cairo');

    // Robots meta directive
    if (meta.noindex) {
      setTag('robots', 'noindex, nofollow');
      setTag('googlebot', 'noindex, nofollow');
    } else {
      const robotsDirective = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
      setTag('robots', robotsDirective);
      setTag('googlebot', robotsDirective);
      setTag('bingbot', robotsDirective);
    }

    // Open Graph
    setTag('og:site_name', siteName, true);
    setTag('og:title', fullTitle, true);
    setTag('og:description', desc, true);
    setTag('og:image', fullImgUrl, true);
    setTag('og:image:alt', fullTitle, true);
    setTag('og:url', canonicalUrl, true);
    setTag('og:type', meta.type || 'website', true);
    setTag('og:locale', isAr ? 'ar_EG' : 'en_US', true);
    setTag('og:locale:alternate', isAr ? 'en_US' : 'ar_EG', true);

    // Twitter Card
    setTag('twitter:card', 'summary_large_image');
    setTag('twitter:title', fullTitle);
    setTag('twitter:description', desc);
    setTag('twitter:image', fullImgUrl);
    setTag('twitter:url', canonicalUrl);

    // Canonical link tag
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Hreflang link tags (Multi-language SEO)
    this.updateHreflangTags(canonicalUrl);

    // Dynamic Schema.org JSON-LD structured data
    this.injectJSONLD(meta, canonicalUrl, fullTitle, desc, fullImgUrl, isAr);
  },

  /**
   * Updates hreflang links dynamically to maintain multilingual indexability
   */
  updateHreflangTags(canonicalUrl: string) {
    const updateOrCreateHreflang = (lang: string, href: string) => {
      let el = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`) as HTMLLinkElement;
      if (!el) {
        el = document.createElement('link');
        el.rel = 'alternate';
        el.hreflang = lang;
        document.head.appendChild(el);
      }
      el.href = href;
    };

    updateOrCreateHreflang('x-default', canonicalUrl);
    updateOrCreateHreflang('en', canonicalUrl);
    updateOrCreateHreflang('ar', canonicalUrl);
  },

  /**
   * Generates and injects comprehensive Schema.org JSON-LD
   */
  injectJSONLD(
    meta: SEOMetadata,
    canonicalUrl: string,
    title: string,
    description: string,
    imageUrl: string,
    isAr: boolean
  ) {
    const existing = document.getElementById('toomakt-jsonld');
    if (existing) existing.remove();

    const graph: any[] = [
      // 1. Organization & Atelier Storefront
      {
        '@type': 'ConfectioneryStore',
        '@id': `${this.productionDomain}/#store`,
        'name': isAr ? 'معمل توماكت للحلويات الفاخرة' : 'toomakt Confectionery Atelier',
        'alternateName': ['toomakt', 'توماكت', 'شركة الزهرة للحلويات'],
        'url': `${this.productionDomain}/`,
        'logo': `${this.productionDomain}/images/logos/toomakt_logo_main.png`,
        'image': `${this.productionDomain}/images/hero/hero_spec.jpg`,
        'description': isAr ? this.defaultDescriptionAr : this.defaultDescriptionEn,
        'telephone': '+201024542139',
        'priceRange': '$$',
        'currenciesAccepted': 'EGP',
        'paymentAccepted': 'Cash on Delivery, InstaPay, Visa, MasterCard',
        'areaServed': {
          '@type': 'Country',
          'name': 'Egypt',
          'identifier': 'EG',
        },
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Cairo',
          'addressRegion': 'Cairo Governorate',
          'addressCountry': 'EG',
        },
        'sameAs': [
          'https://wa.me/201024542139',
          'https://instagram.com/toomakt'
        ]
      },
      // 2. WebSite with SearchAction
      {
        '@type': 'WebSite',
        '@id': `${this.productionDomain}/#website`,
        'url': `${this.productionDomain}/`,
        'name': 'toomakt',
        'description': isAr ? this.defaultDescriptionAr : this.defaultDescriptionEn,
        'inLanguage': ['en', 'ar'],
        'publisher': {
          '@id': `${this.productionDomain}/#store`
        },
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': `${this.productionDomain}/shop?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      }
    ];

    // 3. Product Schema (with genuine Offer & specifications)
    if (meta.productData) {
      const p = meta.productData;
      const productSchema: any = {
        '@type': 'Product',
        '@id': `${canonicalUrl}#product`,
        'name': p.name,
        'description': p.description || description,
        'image': this.getImageUrl(p.image),
        'sku': p.sku || `TMK-${p.name.slice(0, 10).replace(/\s+/g, '-').toUpperCase()}`,
        'brand': {
          '@type': 'Brand',
          'name': p.brand || 'toomakt'
        },
        'category': p.category || 'Confectionery',
        'offers': {
          '@type': 'Offer',
          'url': canonicalUrl,
          'price': Number(p.price).toFixed(2),
          'priceCurrency': 'EGP',
          'availability': p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          'itemCondition': 'https://schema.org/NewCondition',
          'seller': {
            '@id': `${this.productionDomain}/#store`
          }
        }
      };

      if (p.rating && p.reviewCount) {
        productSchema.aggregateRating = {
          '@type': 'AggregateRating',
          'ratingValue': Number(p.rating).toFixed(1),
          'reviewCount': Math.max(1, p.reviewCount),
          'bestRating': '5',
          'worstRating': '1'
        };
      }

      graph.push(productSchema);
    }

    // 4. Category / CollectionPage Schema
    if (meta.categoryData) {
      const cat = meta.categoryData;
      graph.push({
        '@type': 'CollectionPage',
        '@id': `${canonicalUrl}#collection`,
        'url': canonicalUrl,
        'name': cat.name,
        'description': cat.description,
        'isPartOf': {
          '@id': `${this.productionDomain}/#website`
        }
      });
    }

    // 5. BreadcrumbList Schema
    if (meta.breadcrumbs && meta.breadcrumbs.length > 0) {
      graph.push({
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumbs`,
        'itemListElement': meta.breadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          'position': i + 1,
          'name': b.name,
          'item': this.getCanonicalUrl(b.url)
        }))
      });
    }

    // 6. FAQPage Schema (Only when genuine visible FAQs exist)
    if (meta.faqs && meta.faqs.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        'mainEntity': meta.faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        }))
      });
    }

    const script = document.createElement('script');
    script.id = 'toomakt-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph
    }, null, 2);
    document.head.appendChild(script);
  }
};
