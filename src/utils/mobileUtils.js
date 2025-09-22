// Mobile utility functions for enhanced touch experience

// Detect if device is mobile
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         window.innerWidth <= 768;
};

// Detect if device supports touch
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Add haptic feedback for supported devices
export const hapticFeedback = (type = 'light') => {
  if ('vibrate' in navigator) {
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(20);
        break;
      case 'heavy':
        navigator.vibrate([10, 10, 10]);
        break;
      default:
        navigator.vibrate(10);
    }
  }
};

// Prevent zoom on input focus (iOS)
export const preventZoom = () => {
  if (isMobile()) {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    }
  }
};

// Restore zoom after input blur
export const restoreZoom = () => {
  if (isMobile()) {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
    }
  }
};

// Add mobile-specific CSS classes
export const addMobileClasses = () => {
  if (isMobile()) {
    document.body.classList.add('mobile-device');
  }
  if (isTouchDevice()) {
    document.body.classList.add('touch-device');
  }
};

// Smooth scroll to element on mobile
export const smoothScrollTo = (element, offset = 0) => {
  if (isMobile() && element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};

// Handle mobile table scrolling
export const setupMobileTableScrolling = () => {
  if (isMobile()) {
    const tables = document.querySelectorAll('.table-container');
    tables.forEach(table => {
      let isScrolling = false;
      
      table.addEventListener('scroll', () => {
        if (!isScrolling) {
          isScrolling = true;
          table.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
          
          setTimeout(() => {
            isScrolling = false;
            table.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
          }, 150);
        }
      });
    });
  }
};

// Initialize mobile features
export const initMobileFeatures = () => {
  addMobileClasses();
  setupMobileTableScrolling();
  
  // Add touch event listeners for better interactions
  if (isTouchDevice()) {
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchend', () => {}, { passive: true });
  }
};

// Mobile-specific error handling
export const handleMobileError = (error) => {
  console.error('Mobile error:', error);
  
  // Show mobile-friendly error message
  const errorElement = document.createElement('div');
  errorElement.className = 'mobile-error-toast';
  errorElement.innerHTML = `
    <div class="error-content">
      <p>Something went wrong. Please try again.</p>
      <button onclick="this.parentElement.parentElement.remove()">Dismiss</button>
    </div>
  `;
  
  document.body.appendChild(errorElement);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (errorElement.parentElement) {
      errorElement.remove();
    }
  }, 5000);
};
