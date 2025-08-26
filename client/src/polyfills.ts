// Microsoft Edge compatibility polyfills

// URL polyfill for older Edge versions
if (!globalThis.URL && (globalThis as any).webkitURL) {
  globalThis.URL = (globalThis as any).webkitURL;
}

// ResizeObserver polyfill for Edge < 76
if (!globalThis.ResizeObserver) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/resize-observer-polyfill@1.5.1/dist/ResizeObserver.min.js';
  document.head.appendChild(script);
}

// IntersectionObserver polyfill for Edge < 15
if (!globalThis.IntersectionObserver) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/intersection-observer@0.12.2/intersection-observer.js';
  document.head.appendChild(script);
}

// Fetch polyfill for Edge < 14
if (!globalThis.fetch) {
  import('https://cdn.jsdelivr.net/npm/whatwg-fetch@3.6.20/dist/fetch.umd.js');
}

// Object.fromEntries polyfill for Edge < 79
if (!Object.fromEntries) {
  Object.fromEntries = function<T = any>(entries: Iterable<readonly [PropertyKey, T]>): { [k: string]: T } {
    const o: { [k: string]: T } = {};
    for (const [k, v] of entries) {
      o[k as string] = v;
    }
    return o;
  };
}

// Array.prototype.flat polyfill for Edge < 79
if (!Array.prototype.flat) {
  Array.prototype.flat = function(depth = 1) {
    const flatten = (arr: any[], currentDepth: number): any[] => {
      return currentDepth > 0 
        ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val, currentDepth - 1) : val), [])
        : arr.slice();
    };
    return flatten(this, depth);
  };
}

// String.prototype.matchAll polyfill for Edge < 79
if (!String.prototype.matchAll) {
  String.prototype.matchAll = function*(regexp: RegExp) {
    if (!regexp.global) {
      throw new TypeError('String.prototype.matchAll called with a non-global RegExp argument');
    }
    let match;
    while ((match = regexp.exec(this)) !== null) {
      yield match;
    }
  };
}

// AbortController polyfill for Edge < 16
if (!globalThis.AbortController) {
  class AbortController {
    signal: AbortSignal;
    
    constructor() {
      this.signal = new AbortSignal();
    }
    
    abort() {
      (this.signal as any).aborted = true;
      (this.signal as any).dispatchEvent(new Event('abort'));
    }
  }
  
  class AbortSignal {
    aborted: boolean = false;
    onabort: ((this: AbortSignal, ev: Event) => any) | null = null;
    
    addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
      if (type === 'abort') {
        this.onabort = listener as (this: AbortSignal, ev: Event) => any;
      }
    }
    
    removeEventListener() {
      this.onabort = null;
    }
    
    dispatchEvent(event: Event) {
      if (this.onabort) {
        this.onabort.call(this, event);
      }
      return true;
    }
  }
  
  globalThis.AbortController = AbortController;
  globalThis.AbortSignal = AbortSignal;
}

// CSS.supports polyfill for Edge < 12
if (!globalThis.CSS || !globalThis.CSS.supports) {
  if (!globalThis.CSS) {
    globalThis.CSS = {} as any;
  }
  globalThis.CSS.supports = function(property: string, value?: string) {
    const style = document.createElement('div').style;
    try {
      if (value !== undefined) {
        (style as any)[property] = value;
        return (style as any)[property] === value;
      } else {
        // For property/value pair in one string
        const [prop, val] = property.split(':').map(s => s.trim());
        (style as any)[prop] = val;
        return (style as any)[prop] === val;
      }
    } catch {
      return false;
    }
  };
}

// Performance.now polyfill for Edge compatibility
if (!globalThis.performance || !globalThis.performance.now) {
  if (!globalThis.performance) {
    globalThis.performance = {} as Performance;
  }
  globalThis.performance.now = function() {
    return Date.now();
  };
}

export {};