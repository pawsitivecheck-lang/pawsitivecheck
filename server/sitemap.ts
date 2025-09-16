// XML Sitemap generation for PawsitiveCheck
import { storage } from "./storage";

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: string;
}

export class SitemapGenerator {
  private baseUrl = 'https://pawsitivecheck.com';
  
  constructor(baseUrl?: string) {
    if (baseUrl) {
      this.baseUrl = baseUrl;
    }
  }

  // Generate static pages sitemap
  private getStaticPages(): SitemapUrl[] {
    const now = new Date().toISOString();
    
    return [
      {
        loc: this.baseUrl,
        lastmod: now,
        changefreq: 'daily',
        priority: '1.0'
      },
      {
        loc: `${this.baseUrl}/home`,
        lastmod: now, 
        changefreq: 'daily',
        priority: '0.9'
      },
      {
        loc: `${this.baseUrl}/product-database`,
        lastmod: now,
        changefreq: 'daily', 
        priority: '0.9'
      },
      {
        loc: `${this.baseUrl}/recalls`,
        lastmod: now,
        changefreq: 'hourly',
        priority: '0.9'
      },
      {
        loc: `${this.baseUrl}/community`,
        lastmod: now,
        changefreq: 'daily',
        priority: '0.8'
      },
      {
        loc: `${this.baseUrl}/products`,
        lastmod: now,
        changefreq: 'daily',
        priority: '0.8'
      },
      {
        loc: `${this.baseUrl}/livestock`,
        lastmod: now,
        changefreq: 'weekly',
        priority: '0.7'
      },
      {
        loc: `${this.baseUrl}/vet-finder`,
        lastmod: now,
        changefreq: 'weekly',
        priority: '0.7'
      },
      {
        loc: `${this.baseUrl}/comprehensive-safety-analysis`,
        lastmod: now,
        changefreq: 'weekly',
        priority: '0.7'
      },
      {
        loc: `${this.baseUrl}/product-scanner`,
        lastmod: now,
        changefreq: 'weekly',
        priority: '0.7'
      }
    ];
  }

  // Generate dynamic product pages
  private async getProductPages(): Promise<SitemapUrl[]> {
    try {
      const products = await storage.getAllProducts();
      return products.map(product => ({
        loc: `${this.baseUrl}/product/${product.id}`,
        lastmod: product.updatedAt || product.createdAt || new Date().toISOString(),
        changefreq: 'weekly' as const,
        priority: '0.8'
      }));
    } catch (error) {
      console.error('Error fetching products for sitemap:', error);
      return [];
    }
  }

  // Generate XML sitemap content
  public async generateSitemap(): Promise<string> {
    const staticPages = this.getStaticPages();
    const productPages = await this.getProductPages();
    
    const allPages = [...staticPages, ...productPages];
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const page of allPages) {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(page.loc)}</loc>\n`;
      
      if (page.lastmod) {
        xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
      }
      
      if (page.changefreq) {
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      }
      
      if (page.priority) {
        xml += `    <priority>${page.priority}</priority>\n`;
      }
      
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';
    
    return xml;
  }

  // Escape XML special characters
  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Generate robots.txt content
  public generateRobotsTxt(): string {
    return `# Robots.txt for PawsitiveCheck.com
# Pet Product Safety Analysis Platform

User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin-dashboard  
Disallow: /vet-admin
Disallow: /admin-product-submissions
Disallow: /api/
Disallow: /private/
Disallow: /*.json
Disallow: /tmp/
Disallow: /uploads/
Disallow: /logs/
Disallow: /404

# Allow important SEO pages
Allow: /
Allow: /home
Allow: /product-database
Allow: /recalls  
Allow: /community
Allow: /products
Allow: /livestock
Allow: /vet-finder
Allow: /comprehensive-safety-analysis
Allow: /product-scanner
Allow: /sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Sitemap location
Sitemap: ${this.baseUrl}/sitemap.xml

# Block known bad bots
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot  
Disallow: /

User-agent: MJ12bot
Disallow: /

# Allow GoogleBot full access to important pages
User-agent: Googlebot
Allow: /
Allow: /product/
Allow: /products
Allow: /recalls
Allow: /community
Disallow: /admin
Disallow: /api/

# Social media crawlers
User-agent: facebookexternalhit
Allow: /
Allow: /product/
Allow: /products

User-agent: Twitterbot  
Allow: /
Allow: /product/
Allow: /products`;
  }
}