export interface SeoPixelConfig {
  metaTitle: string;
  metaDescription: string;
  focusKeywords: string;
  canonicalUrl: string;
  ogImageUrl: string;
  robotsIndex: boolean;
  metaPixelId: string;
  metaPixelActive: boolean;
  tiktokPixelId: string;
  tiktokPixelActive: boolean;
  ga4MeasurementId: string;
  ga4Active: boolean;
  gtmContainerId: string;
  gtmActive: boolean;
  snapchatPixelId: string;
  snapchatPixelActive: boolean;
}

export const DEFAULT_SEO_CONFIG: SeoPixelConfig = {
  metaTitle: 'toomakt — Fruit, slowly made. | Artisanal Fruit Toffee',
  metaDescription: 'Artisanal fruit toffee crafted slowly with real whole fruit purée and European sweet cream butter in Cairo, Egypt.',
  focusKeywords: 'fruit toffee, artisanal confectionery, Cairo toffee, gourmet sweets egypt, handcrafted caramel, mango sunbeam',
  canonicalUrl: 'https://toomakt.com',
  ogImageUrl: '/images/hero/hero_spec.jpg',
  robotsIndex: true,
  metaPixelId: '',
  metaPixelActive: false,
  tiktokPixelId: '',
  tiktokPixelActive: false,
  ga4MeasurementId: '',
  ga4Active: false,
  gtmContainerId: '',
  gtmActive: false,
  snapchatPixelId: '',
  snapchatPixelActive: false,
};

const STORAGE_KEY = 'toomakt_seo_pixel_config';

export function getStoredSeoConfig(): SeoPixelConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SEO_CONFIG;
    return { ...DEFAULT_SEO_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SEO_CONFIG;
  }
}

function updateMetaTag(nameOrProperty: 'name' | 'property', key: string, content: string) {
  if (!content) return;
  let tag = document.querySelector(`meta[${nameOrProperty}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(nameOrProperty, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
  if (!href) return;
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export function applySeoAndTracking(config: SeoPixelConfig = getStoredSeoConfig()) {
  if (typeof document === 'undefined') return;

  // 1. Title & Meta Descriptions
  if (config.metaTitle) {
    document.title = config.metaTitle;
  }
  updateMetaTag('name', 'description', config.metaDescription);
  updateMetaTag('name', 'keywords', config.focusKeywords);
  updateMetaTag('name', 'robots', config.robotsIndex ? 'index, follow' : 'noindex, nofollow');
  updateLinkTag('canonical', config.canonicalUrl || 'https://toomakt.com');

  // Open Graph Social Share Tags
  updateMetaTag('property', 'og:title', config.metaTitle);
  updateMetaTag('property', 'og:description', config.metaDescription);
  updateMetaTag('property', 'og:url', config.canonicalUrl || 'https://toomakt.com');
  updateMetaTag('property', 'og:image', config.ogImageUrl || '/images/hero/hero_spec.jpg');
  updateMetaTag('property', 'og:type', 'website');

  // 2. Meta (Facebook) Pixel
  if (config.metaPixelActive && config.metaPixelId.trim()) {
    const pixelId = config.metaPixelId.trim();
    if (!document.getElementById('toomakt-meta-pixel')) {
      const script = document.createElement('script');
      script.id = 'toomakt-meta-pixel';
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    }
  }

  // 3. TikTok Pixel
  if (config.tiktokPixelActive && config.tiktokPixelId.trim()) {
    const ttId = config.tiktokPixelId.trim();
    if (!document.getElementById('toomakt-tiktok-pixel')) {
      const script = document.createElement('script');
      script.id = 'toomakt-tiktok-pixel';
      script.innerHTML = `
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
          ttq.load('${ttId}');
          ttq.page();
        }(window, document, 'ttq');
      `;
      document.head.appendChild(script);
    }
  }

  // 4. Google Analytics 4 (GA4)
  if (config.ga4Active && config.ga4MeasurementId.trim()) {
    const gaId = config.ga4MeasurementId.trim();
    if (!document.getElementById('toomakt-ga4-script')) {
      const gTagScript = document.createElement('script');
      gTagScript.id = 'toomakt-ga4-script';
      gTagScript.async = true;
      gTagScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(gTagScript);

      const initScript = document.createElement('script');
      initScript.id = 'toomakt-ga4-init';
      initScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `;
      document.head.appendChild(initScript);
    }
  }

  // 5. Google Tag Manager (GTM)
  if (config.gtmActive && config.gtmContainerId.trim()) {
    const gtmId = config.gtmContainerId.trim();
    if (!document.getElementById('toomakt-gtm-script')) {
      const script = document.createElement('script');
      script.id = 'toomakt-gtm-script';
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `;
      document.head.appendChild(script);
    }
  }

  // 6. Snapchat Pixel
  if (config.snapchatPixelActive && config.snapchatPixelId.trim()) {
    const snapId = config.snapchatPixelId.trim();
    if (!document.getElementById('toomakt-snapchat-pixel')) {
      const script = document.createElement('script');
      script.id = 'toomakt-snapchat-pixel';
      script.innerHTML = `
        (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
        {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
        a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;
        r.src=n;var u=t.getElementsByTagName(s)[0];
        u.parentNode.insertBefore(r,u);})(window,document,
        'https://sc-static.net/scevent.min.js');
        snaptr('init', '${snapId}');
        snaptr('track', 'PAGE_VIEW');
      `;
      document.head.appendChild(script);
    }
  }
}

/**
 * Initializes automatic listener to update SEO and tracking pixels whenever saved in admin
 */
export function initSeoAndTracking(): () => void {
  applySeoAndTracking();

  const handleUpdate = () => {
    applySeoAndTracking();
  };

  window.addEventListener('toomakt:seo-updated', handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener('toomakt:seo-updated', handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
}
