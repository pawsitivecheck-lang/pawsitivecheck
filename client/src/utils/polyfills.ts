// Polyfills for older browsers

// Array.includes polyfill for IE
if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement: any, fromIndex?: number): boolean {
    const o = Object(this);
    const len = parseInt(String(o.length)) || 0;
    if (len === 0) return false;
    const n = parseInt(String(fromIndex)) || 0;
    let k = n >= 0 ? n : Math.max(len + n, 0);
    
    function sameValueZero(x: any, y: any): boolean {
      return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
    }
    
    for (; k < len; k++) {
      if (sameValueZero(o[k], searchElement)) {
        return true;
      }
    }
    return false;
  };
}

// Object.assign polyfill for IE
if (typeof Object.assign !== 'function') {
  Object.assign = function(target: any): any {
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    const to = Object(target);
    const sources = Array.prototype.slice.call(arguments, 1);

    for (let index = 0; index < sources.length; index++) {
      const nextSource = sources[index];

      if (nextSource != null) {
        for (const nextKey in nextSource) {
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

// Promise polyfill check (basic detection)
if (typeof Promise === 'undefined') {
  console.warn('Promise polyfill may be needed for older browsers');
}

// Fetch polyfill check
if (typeof fetch === 'undefined') {
  console.warn('Fetch polyfill may be needed for older browsers');
}

// IntersectionObserver polyfill check
if (typeof IntersectionObserver === 'undefined') {
  console.warn('IntersectionObserver polyfill may be needed for older browsers');
}

// ResizeObserver polyfill check
if (typeof ResizeObserver === 'undefined') {
  console.warn('ResizeObserver polyfill may be needed for older browsers');
}

// Custom Event polyfill for IE
if (typeof CustomEvent !== 'function') {
  function CustomEventPolyfill(event: string, params?: CustomEventInit): Event {
    params = params || { bubbles: false, cancelable: false, detail: null };
    const evt = document.createEvent('CustomEvent');
    (evt as any).initCustomEvent(event, params.bubbles || false, params.cancelable || false, params.detail);
    return evt;
  }
  (window as any).CustomEvent = CustomEventPolyfill;
}

// Performance.now polyfill
if (typeof window !== 'undefined' && (!window.performance || !window.performance.now)) {
  (window as any).performance = (window as any).performance || {};
  window.performance.now = function(): number {
    return Date.now();
  };
}

export {}; // Make this a module