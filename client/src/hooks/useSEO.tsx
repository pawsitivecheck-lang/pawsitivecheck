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
  structuredData?: object | object[];
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
    updateMetaTag('og:site_name', 'PawsitiveCheck', true);
    updateMetaTag('og:locale', 'en_US', true);
    
    if (ogImage) {
      updateMetaTag('og:image', ogImage, true);
      updateMetaTag('og:image:width', '512', true);
      updateMetaTag('og:image:height', '512', true);
      updateMetaTag('og:image:alt', ogTitle || title, true);
      updateMetaTag('og:image:type', 'image/png', true);
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
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', twitterTitle || ogTitle || title);
    updateMetaTag('twitter:description', twitterDescription || ogDescription || description);
    updateMetaTag('twitter:site', '@PawsitiveCheck');
    updateMetaTag('twitter:creator', '@PawsitiveCheck');
    
    if (twitterImage || ogImage) {
      updateMetaTag('twitter:image', twitterImage || ogImage || '');
      updateMetaTag('twitter:image:alt', twitterTitle || ogTitle || title);
    }

    // Add structured data
    if (structuredData) {
      // Remove existing structured data for this page
      const existingScripts = document.querySelectorAll('script[data-seo-structured]');
      existingScripts.forEach(script => script.remove());

      // Handle multiple structured data objects
      const dataArray = Array.isArray(structuredData) ? structuredData : [structuredData];
      
      dataArray.forEach((data, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-structured', `true-${index}`);
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
      });
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

// Utility function to generate organization structured data
export const generateOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PawsitiveCheck",
    "url": "https://pawsitivecheck.com",
    "logo": "https://pawsitivecheck.com/icon-512.png",
    "description": "Comprehensive pet product safety analysis platform providing barcode scanning, AI-powered safety analysis, recall alerts, and community reviews.",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/PawsitiveCheck",
      "https://facebook.com/PawsitiveCheck"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@pawsitivecheck.com"
    },
    "areaServed": "US",
    "knowsAbout": [
      "Pet Product Safety",
      "Pet Food Analysis", 
      "Product Recalls",
      "Pet Health",
      "Animal Safety"
    ]
  };
};

// Utility function to generate service structured data
export const generateServiceStructuredData = (service: {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "url": service.url,
    "serviceType": service.serviceType || "Pet Product Safety Analysis",
    "provider": {
      "@type": "Organization",
      "name": "PawsitiveCheck",
      "url": "https://pawsitivecheck.com"
    },
    "areaServed": "US",
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": service.url,
      "serviceType": "online"
    }
  };
};

// Utility function to generate FAQ structured data
export const generateFAQStructuredData = (faqs: Array<{question: string, answer: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Utility function to generate how-to structured data
export const generateHowToStructuredData = (howTo: {
  name: string;
  description: string;
  steps: Array<{name: string, text: string}>;
  totalTime?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": howTo.name,
    "description": howTo.description,
    "totalTime": howTo.totalTime,
    "supply": ["Pet Product", "Smartphone or Computer"],
    "tool": ["PawsitiveCheck Platform", "Barcode Scanner"],
    "step": howTo.steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text
    }))
  };
};

// Utility function to generate local business structured data for vet finder
export const generateLocalBusinessStructuredData = (business: {
  name: string;
  address: string;
  phone?: string;
  url?: string;
  rating?: number;
  reviewCount?: number;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "VeterinaryCare",
    "name": business.name,
    "address": business.address,
    "telephone": business.phone,
    "url": business.url,
    "aggregateRating": business.rating ? {
      "@type": "AggregateRating",
      "ratingValue": business.rating,
      "reviewCount": business.reviewCount || 1,
      "bestRating": 5,
      "worstRating": 1
    } : undefined
  };
};