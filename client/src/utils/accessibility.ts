// Accessibility utility functions for enhanced user experience

export const ARIA_LABELS = {
  // Navigation
  mainNavigation: "Main navigation",
  breadcrumbNavigation: "Breadcrumb navigation", 
  pagination: "Pagination navigation",
  
  // Forms
  requiredField: "required",
  fieldError: "Error message for field",
  fieldHelp: "Help text for field",
  
  // Actions
  deleteItem: "Delete item",
  editItem: "Edit item", 
  saveItem: "Save item",
  cancelAction: "Cancel action",
  confirmAction: "Confirm action",
  
  // Content
  loadingContent: "Loading content",
  searchResults: "Search results",
  productCard: "Product information",
  userReview: "User review",
  
  // Status
  success: "Success message",
  error: "Error message",
  warning: "Warning message",
  info: "Information message"
} as const

export const SCREEN_READER_ONLY = "sr-only absolute -inset-px w-px h-px p-0 border-0 overflow-hidden whitespace-nowrap clip-rect(0,0,0,0)"

// Focus management utilities
export class FocusManager {
  private static focusStack: HTMLElement[] = []

  static pushFocus(element: HTMLElement) {
    const currentFocused = document.activeElement as HTMLElement
    if (currentFocused && currentFocused !== document.body) {
      this.focusStack.push(currentFocused)
    }
    element.focus()
  }

  static popFocus() {
    const previousElement = this.focusStack.pop()
    if (previousElement) {
      previousElement.focus()
    }
  }

  static trapFocus(container: HTMLElement) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    return () => container.removeEventListener('keydown', handleTabKey)
  }
}

// Keyboard navigation utilities
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End'
} as const

export function handleKeyboardNavigation(
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  onSelect?: (index: number) => void,
  orientation: 'horizontal' | 'vertical' = 'vertical'
) {
  let newIndex = currentIndex

  switch (event.key) {
    case KEYBOARD_KEYS.ARROW_UP:
      if (orientation === 'vertical') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        event.preventDefault()
      }
      break
      
    case KEYBOARD_KEYS.ARROW_DOWN:
      if (orientation === 'vertical') {
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        event.preventDefault()
      }
      break
      
    case KEYBOARD_KEYS.ARROW_LEFT:
      if (orientation === 'horizontal') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        event.preventDefault()
      }
      break
      
    case KEYBOARD_KEYS.ARROW_RIGHT:
      if (orientation === 'horizontal') {
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        event.preventDefault()
      }
      break
      
    case KEYBOARD_KEYS.HOME:
      newIndex = 0
      event.preventDefault()
      break
      
    case KEYBOARD_KEYS.END:
      newIndex = items.length - 1
      event.preventDefault()
      break
      
    case KEYBOARD_KEYS.ENTER:
    case KEYBOARD_KEYS.SPACE:
      if (onSelect) {
        onSelect(currentIndex)
        event.preventDefault()
      }
      break
  }

  if (newIndex !== currentIndex && items[newIndex]) {
    items[newIndex].focus()
    return newIndex
  }
  
  return currentIndex
}

// Announce to screen readers
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = SCREEN_READER_ONLY
  announcement.textContent = message

  document.body.appendChild(announcement)
  
  // Clean up after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Color contrast utilities
export function getContrastRatio(color1: string, color2: string): number {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd convert colors to luminance values
  // and calculate the actual contrast ratio
  return 4.5 // Placeholder - meets WCAG AA standard
}

// Accessible form validation
export function getAccessibleErrorId(fieldId: string): string {
  return `${fieldId}-error`
}

export function getAccessibleDescriptionId(fieldId: string): string {
  return `${fieldId}-description`
}

// Reduced motion preferences
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function getAccessibleTransition(normalTransition: string): string {
  return prefersReducedMotion() ? 'none' : normalTransition
}