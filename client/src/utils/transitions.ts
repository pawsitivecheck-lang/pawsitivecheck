// Smooth transition utilities for enhanced UX

export const TRANSITION_DURATIONS = {
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500
} as const

export const TRANSITION_EASINGS = {
  easeOut: 'ease-out',
  easeIn: 'ease-in',
  easeInOut: 'ease-in-out',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
} as const

export const TRANSITION_CLASSES = {
  // Button transitions
  button: 'transition-all duration-200 ease-out transform hover:scale-[1.02] active:scale-[0.98]',
  buttonSoft: 'transition-colors duration-200 ease-out',
  
  // Card transitions
  card: 'transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1',
  cardSoft: 'transition-all duration-200 ease-out hover:shadow-md',
  
  // Modal transitions
  modal: 'transition-all duration-200 ease-out',
  overlay: 'transition-opacity duration-200 ease-out',
  
  // Page transitions
  page: 'transition-all duration-300 ease-in-out',
  
  // Loading transitions
  fadeIn: 'animate-in fade-in duration-200',
  fadeOut: 'animate-out fade-out duration-150',
  slideUp: 'animate-in slide-in-from-bottom-4 duration-200',
  slideDown: 'animate-out slide-out-to-bottom-4 duration-150',
  
  // Focus transitions
  focus: 'transition-all duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  
  // Hover effects
  hoverLift: 'transition-transform duration-200 ease-out hover:-translate-y-0.5',
  hoverGlow: 'transition-all duration-200 ease-out hover:shadow-glow',
  hoverScale: 'transition-transform duration-150 ease-out hover:scale-105',
  
  // State changes
  stateChange: 'transition-all duration-200 ease-in-out',
  colorChange: 'transition-colors duration-200 ease-out',
  opacityChange: 'transition-opacity duration-200 ease-out'
} as const

// Animation delay utilities for staggered animations
export const staggerDelay = (index: number, baseDelay: number = 50) => ({
  animationDelay: `${index * baseDelay}ms`
})

// CSS-in-JS style objects for JavaScript animations
export const createTransition = (
  property: string = 'all',
  duration: keyof typeof TRANSITION_DURATIONS = 'normal',
  easing: keyof typeof TRANSITION_EASINGS = 'easeOut'
) => ({
  transition: `${property} ${TRANSITION_DURATIONS[duration]}ms ${TRANSITION_EASINGS[easing]}`
})

// Utility for creating smooth scroll behavior
export const smoothScrollTo = (element: HTMLElement, options?: ScrollIntoViewOptions) => {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'start',
    ...options
  })
}

// Utility for staggered list animations
export const createStaggeredAnimation = (items: any[], baseDelay: number = 100) => {
  return items.map((item, index) => ({
    ...item,
    style: {
      ...item.style,
      animationDelay: `${index * baseDelay}ms`
    }
  }))
}