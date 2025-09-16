import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

export const useSEO = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl,
  structuredData
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (element) {
        element.content = content;
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.content = content;
        document.head.appendChild(element);
      }
    };

    // Update basic meta tags
    updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);

    // Update Open Graph tags
    updateMetaTag('og:title', ogTitle || title, true);
    updateMetaTag('og:description', ogDescription || description, true);
    updateMetaTag('og:type', ogType, true);
    
    if (ogImage) {
      updateMetaTag('og:image', ogImage, true);
      updateMetaTag('og:image:alt', ogTitle || title, true);
    }
    
    if (canonicalUrl) {
      updateMetaTag('og:url', canonicalUrl, true);
      
      // Update canonical link
      let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (canonicalElement) {
        canonicalElement.href = canonicalUrl;
      } else {
        canonicalElement = document.createElement('link');
        canonicalElement.rel = 'canonical';
        canonicalElement.href = canonicalUrl;
        document.head.appendChild(canonicalElement);
      }
    }

    // Update Twitter Card tags
    updateMetaTag('twitter:title', twitterTitle || ogTitle || title);
    updateMetaTag('twitter:description', twitterDescription || ogDescription || description);
    
    if (twitterImage || ogImage) {
      updateMetaTag('twitter:image', twitterImage || ogImage || '');
      updateMetaTag('twitter:image:alt', twitterTitle || ogTitle || title);
    }

    // Add structured data
    if (structuredData) {
      // Remove existing structured data for this page
      const existingScript = document.querySelector('script[data-seo-structured]');
      if (existingScript) {
        existingScript.remove();
      }

      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-structured', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup function to reset to defaults when component unmounts
    return () => {
      document.title = 'PawsitiveCheck - Pet Product Safety Analysis';
      updateMetaTag('description', 'Comprehensive pet product safety analysis platform providing barcode scanning, AI-powered safety analysis, recall alerts, and community reviews.');
      updateMetaTag('og:title', 'PawsitiveCheck - Pet Product Safety Analysis', true);
      updateMetaTag('og:description', 'Comprehensive pet product safety analysis platform providing barcode scanning, AI-powered safety analysis, recall alerts, and community reviews.', true);
      updateMetaTag('og:type', 'website', true);
    };
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogType, twitterTitle, twitterDescription, twitterImage, canonicalUrl, structuredData]);
};

// Utility function to generate structured data for products
export const generateProductStructuredData = (product: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "category": product.category,
    "image": product.imageUrl || "https://pawsitivecheck.com/icon-512.png",
    "url": `https://pawsitivecheck.com/product/${product.id}`,
    "identifier": {
      "@type": "PropertyValue",
      "propertyID": "sku",
      "value": product.id
    },
    "aggregateRating": product.averageRating ? {
      "@type": "AggregateRating",
      "ratingValue": product.averageRating,
      "ratingCount": product.reviewCount || 1,
      "bestRating": 5,
      "worstRating": 1
    } : undefined,
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": product.price || "0",
      "priceCurrency": "USD",
      "url": `https://pawsitivecheck.com/product/${product.id}`
    }
  };
};

// Utility function to generate structured data for reviews
export const generateReviewStructuredData = (review: any, product: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "reviewBody": review.content,
    "datePublished": review.createdAt,
    "author": {
      "@type": "Person",
      "name": review.authorName || "Anonymous"
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": 5,
      "worstRating": 1
    },
    "itemReviewed": {
      "@type": "Product",
      "name": product.name,
      "brand": {
        "@type": "Brand", 
        "name": product.brand
      }
    }
  };
};

// Utility function to generate structured data for organization/website pages
export const generateWebPageStructuredData = (page: {
  title: string;
  description: string;
  url: string;
  breadcrumbs?: Array<{name: string, url: string}>;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": page.title,
    "description": page.description,
    "url": page.url,
    "publisher": {
      "@type": "Organization",
      "name": "PawsitiveCheck",
      "logo": "https://pawsitivecheck.com/icon-512.png"
    },
    "breadcrumb": page.breadcrumbs ? {
      "@type": "BreadcrumbList",
      "itemListElement": page.breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    } : undefined
  };
};