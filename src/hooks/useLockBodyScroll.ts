import { useEffect } from 'react';

/**
 * Custom hook to lock body scroll while keeping the scrollbar visible (if it was visible).
 * Prevents layout shift when modal opens/closes.
 */
export function useLockBodyScroll(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    // Save current scroll position
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Check if page was scrollable before locking
    const wasScrollable = document.documentElement.scrollHeight > window.innerHeight;

    // Lock body scroll while preserving scrollbar space (only if there was a scrollbar)
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    
    // Only add scrollbar padding/overflow if page was scrollable
    if (wasScrollable && scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflowY = 'scroll';
    }

    return () => {
      // Restore body styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.paddingRight = '';
      document.body.style.overflowY = '';
      
      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, [isLocked]);
}
