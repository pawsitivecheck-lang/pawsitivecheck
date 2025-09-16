import { InsertAnalyticsEvent, InsertConversionFunnel, InsertFeatureUsage, InsertPerformanceMetric } from '@shared/schema';

// Analytics configuration
export const ANALYTICS_CONFIG = {
  sessionTimeout: 30 * 60 * 1000, // 30 minutes in milliseconds
  batchSize: 10, // Number of events to batch before sending
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  enableDebug: import.meta.env.DEV,
  enablePerformanceTracking: true,
  enableErrorTracking: true,
};

// Generate unique session ID
export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Device detection utilities
export function getDeviceType(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk|(puffin(?!.*(IP|AP|WP)))/.test(userAgent)) {
    return 'tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile|ipad/.test(userAgent)) {
    return 'mobile';
  }
  return 'desktop';
}

export function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  let browserName = 'Unknown';
  let osName = 'Unknown';

  // Browser detection
  if (userAgent.includes('Chrome')) browserName = 'Chrome';
  else if (userAgent.includes('Firefox')) browserName = 'Firefox';
  else if (userAgent.includes('Safari')) browserName = 'Safari';
  else if (userAgent.includes('Edge')) browserName = 'Edge';
  else if (userAgent.includes('Opera')) browserName = 'Opera';

  // OS detection
  if (userAgent.includes('Windows')) osName = 'Windows';
  else if (userAgent.includes('Mac')) osName = 'macOS';
  else if (userAgent.includes('Linux')) osName = 'Linux';
  else if (userAgent.includes('Android')) osName = 'Android';
  else if (userAgent.includes('iOS')) osName = 'iOS';

  return { browserName, osName };
}

// Get UTM parameters from URL
export function getUTMParameters(): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
} {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utmSource: urlParams.get('utm_source') || undefined,
    utmMedium: urlParams.get('utm_medium') || undefined,
    utmCampaign: urlParams.get('utm_campaign') || undefined,
  };
}

// Analytics API client
export class AnalyticsClient {
  private sessionId: string;
  private eventQueue: InsertAnalyticsEvent[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private userId?: string;

  constructor() {
    this.sessionId = generateSessionId();
    this.initializeSession();
  }

  private async initializeSession() {
    try {
      const sessionData = {
        sessionId: this.sessionId,
        isAuthenticated: false,
        entryPage: window.location.pathname + window.location.search,
        referrerUrl: document.referrer || undefined,
        deviceType: getDeviceType(),
        ...getBrowserInfo(),
        ...getUTMParameters(),
      };

      await fetch('/api/analytics/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(sessionData),
      });

      if (ANALYTICS_CONFIG.enableDebug) {
        console.log('✅ Analytics session initialized:', this.sessionId);
      }
    } catch (error) {
      console.error('❌ Failed to initialize analytics session:', error);
    }
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  clearUserId() {
    this.userId = undefined;
  }

  // Track analytics events
  async trackEvent(event: Omit<InsertAnalyticsEvent, 'sessionId' | 'userId' | 'userAgent' | 'deviceType' | 'browserName' | 'osName'>): Promise<void> {
    try {
      const enrichedEvent: InsertAnalyticsEvent = {
        ...event,
        sessionId: this.sessionId,
        userId: this.userId,
        userAgent: navigator.userAgent,
        deviceType: getDeviceType(),
        ...getBrowserInfo(),
        pageUrl: event.pageUrl || window.location.pathname + window.location.search,
        referrerUrl: event.referrerUrl || document.referrer || undefined,
      };

      this.eventQueue.push(enrichedEvent);

      if (this.eventQueue.length >= ANALYTICS_CONFIG.batchSize) {
        await this.flushEvents();
      } else {
        this.scheduleBatch();
      }

      if (ANALYTICS_CONFIG.enableDebug) {
        console.log('📊 Analytics event tracked:', enrichedEvent.eventType, enrichedEvent.eventAction);
      }
    } catch (error) {
      console.error('❌ Failed to track analytics event:', error);
    }
  }

  // Track page views
  async trackPageView(pageUrl?: string, pageTitle?: string): Promise<void> {
    await this.trackEvent({
      eventType: 'page_view',
      eventCategory: 'navigation',
      eventAction: 'page_view',
      eventLabel: pageTitle || document.title,
      pageUrl: pageUrl || window.location.pathname + window.location.search,
      customProperties: {
        title: pageTitle || document.title,
        timestamp: Date.now(),
      },
    });
  }

  // Track user interactions
  async trackInteraction(action: string, category: string = 'user_interaction', label?: string, value?: number, customProperties?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      eventType: 'interaction',
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value,
      customProperties,
    });
  }

  // Track conversions
  async trackConversion(action: string, category: string = 'conversion', label?: string, value?: number, customProperties?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      eventType: 'conversion',
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value,
      customProperties,
    });
  }

  // Track errors
  async trackError(error: Error, context?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      eventType: 'error',
      eventCategory: 'error',
      eventAction: 'javascript_error',
      eventLabel: error.message,
      customProperties: {
        stack: error.stack,
        name: error.name,
        context,
        timestamp: Date.now(),
      },
    });
  }

  // Track performance metrics
  async trackPerformance(metricName: string, value: number, unit: string = 'ms', customData?: Record<string, any>): Promise<void> {
    try {
      const metric: InsertPerformanceMetric = {
        sessionId: this.sessionId,
        userId: this.userId,
        metricType: 'performance',
        metricName,
        value: value.toString(),
        unit,
        pageUrl: window.location.pathname + window.location.search,
        customData,
      };

      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(metric),
      });

      if (ANALYTICS_CONFIG.enableDebug) {
        console.log('⏱️ Performance metric tracked:', metricName, value, unit);
      }
    } catch (error) {
      console.error('❌ Failed to track performance metric:', error);
    }
  }

  // Track feature usage
  async trackFeatureUsage(featureName: string, usageType: 'first_use' | 'repeated_use' | 'feature_completion', success: boolean = true, errorMessage?: string, customProperties?: Record<string, any>): Promise<void> {
    try {
      const usage: InsertFeatureUsage = {
        sessionId: this.sessionId,
        userId: this.userId,
        featureName,
        usageType,
        usageCount: 1,
        success,
        errorMessage,
        customProperties,
      };

      await fetch('/api/analytics/feature-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(usage),
      });

      if (ANALYTICS_CONFIG.enableDebug) {
        console.log('🔧 Feature usage tracked:', featureName, usageType);
      }
    } catch (error) {
      console.error('❌ Failed to track feature usage:', error);
    }
  }

  // Track conversion funnel
  async trackFunnelStep(funnelName: string, stepName: string, stepOrder: number, stepDuration?: number, productId?: number, customData?: Record<string, any>): Promise<void> {
    try {
      const funnelStep: InsertConversionFunnel = {
        sessionId: this.sessionId,
        userId: this.userId,
        funnelName,
        stepName,
        stepOrder,
        stepDuration,
        productId,
        customData,
      };

      await fetch('/api/analytics/funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(funnelStep),
      });

      if (ANALYTICS_CONFIG.enableDebug) {
        console.log('🎯 Conversion funnel step tracked:', funnelName, stepName, stepOrder);
      }
    } catch (error) {
      console.error('❌ Failed to track conversion funnel step:', error);
    }
  }

  private scheduleBatch(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }

    this.batchTimer = setTimeout(() => {
      this.flushEvents();
    }, 5000); // Flush events every 5 seconds
  }

  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ events: eventsToSend }),
      });

      if (ANALYTICS_CONFIG.enableDebug) {
        console.log('📤 Batch of', eventsToSend.length, 'analytics events sent');
      }
    } catch (error) {
      console.error('❌ Failed to send analytics events batch:', error);
      // Re-add failed events to queue for retry
      this.eventQueue.unshift(...eventsToSend);
    }
  }

  // Flush remaining events on page unload
  async destroy(): Promise<void> {
    if (this.eventQueue.length > 0) {
      // Use sendBeacon for reliable delivery on page unload
      if (navigator.sendBeacon) {
        const eventsToSend = [...this.eventQueue];
        navigator.sendBeacon('/api/analytics/events', JSON.stringify({ events: eventsToSend }));
      } else {
        await this.flushEvents();
      }
    }
  }
}

// Global analytics client instance
export const analytics = new AnalyticsClient();

// Performance monitoring utilities
export class PerformanceTracker {
  private static measurements: Record<string, number> = {};

  static startMeasurement(name: string): void {
    this.measurements[name] = performance.now();
  }

  static endMeasurement(name: string, trackToAnalytics: boolean = true): number {
    const endTime = performance.now();
    const startTime = this.measurements[name];
    
    if (!startTime) {
      console.warn(`No start measurement found for: ${name}`);
      return 0;
    }

    const duration = endTime - startTime;
    delete this.measurements[name];

    if (trackToAnalytics && ANALYTICS_CONFIG.enablePerformanceTracking) {
      analytics.trackPerformance(name, duration);
    }

    return duration;
  }

  static measureAsync<T>(name: string, asyncFn: () => Promise<T>): Promise<T> {
    return new Promise(async (resolve, reject) => {
      this.startMeasurement(name);
      try {
        const result = await asyncFn();
        this.endMeasurement(name);
        resolve(result);
      } catch (error) {
        this.endMeasurement(name);
        reject(error);
      }
    });
  }
}

// Error tracking utility
export function setupErrorTracking(): void {
  if (!ANALYTICS_CONFIG.enableErrorTracking) return;

  // Global error handler
  window.addEventListener('error', (event) => {
    analytics.trackError(new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      type: 'javascript_error',
    });
  });

  // Promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    analytics.trackError(new Error(event.reason), {
      type: 'unhandled_promise_rejection',
    });
  });
}

// Initialize analytics on page load
if (typeof window !== 'undefined') {
  setupErrorTracking();

  // Track page unload
  window.addEventListener('beforeunload', () => {
    analytics.destroy();
  });

  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      analytics.trackInteraction('page_visible', 'engagement');
    } else {
      analytics.trackInteraction('page_hidden', 'engagement');
    }
  });
}