// toomakt Dynamic SEO & Structured Data (JSON-LD) Engine

export interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  productData?: {
    name: string;
    description: string;
    image: string;
    price: number | string;
    sku?: string;
    inStock: boolean;
    brand?: string;
  };
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export const seo = {
  defaultTitle: 'toomakt | Luxury Handcrafted Fruit Toffee Egypt',
  defaultDescription: 'Hand-pulled in copper kettles with 100% natural orchard fruit purées. Premium artisanal confectionery delivered fresh across Egypt.',
  defaultImage: '/images/canister.jpg',
  siteName: 'toomakt Confectionery',

  updateMeta(meta: SEOMetadata) {
    if (typeof document === 'undefined') return;

    // 1. Page Title
    const title = meta.title ? `${meta.title} | toomakt` : this.defaultTitle;
    document.title = title;

    // 2. Standard Meta Tags Helper
    const setTag = (nameOrProp: string, val: string, isProp = false) => {
      const attr = isProp ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${nameOrProp}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, nameOrProp);
        document.head.appendChild(el);
      }
      el.content = val;
    };

    const desc = meta.description || this.defaultDescription;
    const img = meta.image || this.defaultImage;
    const fullImgUrl = img.startsWith('http') ? img : `${window.location.origin}${img}`;
    const pageUrl = meta.url || window.location.href;

    setTag('description', desc);
    if (meta.keywords) setTag('keywords', meta.keywords);

    // Open Graph
    setTag('og:site_name', this.siteName, true);
    setTag('og:title', title, true);
    setTag('og:description', desc, true);
    setTag('og:image', fullImgUrl, true);
    setTag('og:url', pageUrl, true);
    setTag('og:type', meta.type || 'website', true);

    // Twitter Card
    setTag('twitter:card', 'summary_large_image');
    setTag('twitter:title', title);
    setTag('twitter:description', desc);
    setTag('twitter:image', fullImgUrl);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = pageUrl;

    // 3. Inject Structured Data (JSON-LD)
    this.injectJSONLD(meta);
  },

  injectJSONLD(meta: SEOMetadata) {
    // Remove existing dynamic script
    const existing = document.getElementById('toomakt-jsonld');
    if (existing) existing.remove();

    const schemas: any[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'ConfectioneryStore',
        'name': this.siteName,
        'image': `${window.location.origin}${this.defaultImage}`,
        'description': this.defaultDescription,
        'priceRange': '$$',
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': 'EG',
          'addressLocality': 'Cairo',
        },
        'currenciesAccepted': 'EGP',
        'paymentAccepted': 'InstaPay, Cash on Delivery, Credit Card',
      },
    ];

    if (meta.productData) {
      const p = meta.productData;
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': p.name,
        'description': p.description,
        'image': p.image.startsWith('http') ? p.image : `${window.location.origin}${p.image}`,
        'sku': p.sku || `TMK-${p.name.replace(/\s+/g, '-').toUpperCase()}`,
        'brand': {
          '@type': 'Brand',
          'name': p.brand || 'toomakt',
        },
        'offers': {
          '@type': 'Offer',
          'price': Number(p.price).toFixed(2),
          'priceCurrency': 'EGP',
          'availability': p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          'itemCondition': 'https://schema.org/NewCondition',
          'url': window.location.href,
        },
      });
    }

    if (meta.breadcrumbs && meta.breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': meta.breadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          'position': i + 1,
          'name': b.name,
          'item': b.url.startsWith('http') ? b.url : `${window.location.origin}${b.url}`,
        })),
      });
    }

    const script = document.createElement('script');
    script.id = 'toomakt-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemas);
    document.head.appendChild(script);
  },
};
