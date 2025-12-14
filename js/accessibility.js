// Accessibility Features
document.addEventListener('DOMContentLoaded', function() {
    // Accessibility panel toggle
    const accessibilityToggle = document.getElementById('accessibilityToggle');
    const accessibilityPanel = document.getElementById('accessibilityPanel');
    const closePanel = document.getElementById('closePanel');
    
    function toggleAccessibilityPanel() {
        if (accessibilityPanel && accessibilityToggle) {
            const isShowing = accessibilityPanel.classList.toggle('show');
            accessibilityToggle.setAttribute('aria-expanded', isShowing);
            accessibilityToggle.classList.toggle('active', isShowing);
            
            // Close panel when clicking outside
            if (isShowing) {
                document.addEventListener('click', closePanelOnClickOutside);
                document.addEventListener('keydown', handleAccessibilityEscapeKey);
            } else {
                document.removeEventListener('click', closePanelOnClickOutside);
                document.removeEventListener('keydown', handleAccessibilityEscapeKey);
            }
        }
    }
    
    function closePanelOnClickOutside(e) {
        if (accessibilityPanel && 
            !accessibilityPanel.contains(e.target) && 
            !accessibilityToggle.contains(e.target)) {
            toggleAccessibilityPanel();
        }
    }
    
    function handleAccessibilityEscapeKey(e) {
        if (e.key === 'Escape' && accessibilityPanel.classList.contains('show')) {
            toggleAccessibilityPanel();
        }
    }
    
    if (accessibilityToggle) {
        accessibilityToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleAccessibilityPanel();
        });
        
        // Keyboard navigation for accessibility panel
        accessibilityToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAccessibilityPanel();
            }
        });
    }
    
    if (closePanel) {
        closePanel.addEventListener('click', function() {
            toggleAccessibilityPanel();
        });
    }
    
    // Text size controls
    const decreaseText = document.getElementById('decreaseText');
    const resetText = document.getElementById('resetText');
    const increaseText = document.getElementById('increaseText');
    const htmlElement = document.documentElement;
    
    let currentTextSize = parseFloat(localStorage.getItem('nzumbiTextSize')) || 1;
    updateTextSize();
    
    function updateTextSize() {
        htmlElement.style.fontSize = currentTextSize * 100 + '%';
        localStorage.setItem('nzumbiTextSize', currentTextSize.toString());
        
        // Update body class for text size
        document.body.classList.remove('text-small', 'text-large', 'text-xlarge', 'text-xxlarge');
        if (currentTextSize <= 0.9) {
            document.body.classList.add('text-small');
        } else if (currentTextSize >= 1.2 && currentTextSize < 1.4) {
            document.body.classList.add('text-large');
        } else if (currentTextSize >= 1.4 && currentTextSize < 1.6) {
            document.body.classList.add('text-xlarge');
        } else if (currentTextSize >= 1.6) {
            document.body.classList.add('text-xxlarge');
        }
    }
    
    if (decreaseText) {
        decreaseText.addEventListener('click', function() {
            currentTextSize = Math.max(0.85, currentTextSize - 0.15);
            updateTextSize();
            announceToScreenReader('Text size decreased');
        });
    }
    
    if (resetText) {
        resetText.addEventListener('click', function() {
            currentTextSize = 1;
            updateTextSize();
            localStorage.removeItem('nzumbiTextSize');
            announceToScreenReader('Text size reset to normal');
        });
    }
    
    if (increaseText) {
        increaseText.addEventListener('click', function() {
            currentTextSize = Math.min(1.6, currentTextSize + 0.15);
            updateTextSize();
            announceToScreenReader('Text size increased');
        });
    }
    
    // High contrast mode
    const toggleContrast = document.getElementById('toggleContrast');
    
    function toggleHighContrast() {
        if (toggleContrast) {
            const isActive = document.body.classList.toggle('high-contrast');
            toggleContrast.classList.toggle('active', isActive);
            toggleContrast.setAttribute('aria-pressed', isActive);
            localStorage.setItem('nzumbiHighContrast', isActive.toString());
            
            announceToScreenReader(isActive ? 'High contrast mode enabled' : 'High contrast mode disabled');
        }
    }
    
    if (toggleContrast) {
        toggleContrast.addEventListener('click', toggleHighContrast);
        
        // Load saved contrast preference
        const savedContrast = localStorage.getItem('nzumbiHighContrast');
        if (savedContrast === 'true') {
            document.body.classList.add('high-contrast');
            toggleContrast.classList.add('active');
            toggleContrast.setAttribute('aria-pressed', 'true');
        }
        
        // Keyboard support
        toggleContrast.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleHighContrast();
            }
        });
    }
    
    // Screen reader announcements
    function announceToScreenReader(message) {
        const announcer = document.getElementById('screen-reader-announcer');
        if (!announcer) {
            const announcerElement = document.createElement('div');
            announcerElement.id = 'screen-reader-announcer';
            announcerElement.className = 'sr-only';
            announcerElement.setAttribute('aria-live', 'polite');
            announcerElement.setAttribute('aria-atomic', 'true');
            document.body.appendChild(announcerElement);
        }
        
        document.getElementById('screen-reader-announcer').textContent = message;
        
        // Clear after 2 seconds
        setTimeout(() => {
            if (document.getElementById('screen-reader-announcer')) {
                document.getElementById('screen-reader-announcer').textContent = '';
            }
        }, 2000);
    }
    
    // Expose announce function globally for other scripts
    window.announceToScreenReader = announceToScreenReader;
    
    // Focus trap for accessibility panel
    if (accessibilityPanel) {
        const focusableElements = accessibilityPanel.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            const firstFocusableElement = focusableElements[0];
            const lastFocusableElement = focusableElements[focusableElements.length - 1];
            
            accessibilityPanel.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusableElement) {
                            e.preventDefault();
                            lastFocusableElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastFocusableElement) {
                            e.preventDefault();
                            firstFocusableElement.focus();
                        }
                    }
                }
            });
        }
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Alt + A to toggle accessibility panel
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            if (accessibilityToggle) {
                accessibilityToggle.click();
            }
        }
        
        // Alt + C to toggle contrast
        if (e.altKey && e.key === 'c') {
            e.preventDefault();
            if (toggleContrast) {
                toggleContrast.click();
            }
        }
        
        // Alt + T to increase text size
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            if (increaseText) {
                increaseText.click();
            }
        }
        
        // Alt + Shift + T to decrease text size
        if (e.altKey && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            if (decreaseText) {
                decreaseText.click();
            }
        }
        
        // Alt + R to reset text size
        if (e.altKey && e.key === 'r') {
            e.preventDefault();
            if (resetText) {
                resetText.click();
            }
        }
    });
    
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Focus management for modals
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('shown', function() {
            const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable) focusable.focus();
        });
    });
    
    // Add focus-visible polyfill if needed
    if (!CSS.supports('selector(:focus-visible)')) {
        document.body.classList.add('js-focus-visible');
        
        document.addEventListener('mousedown', function() {
            document.body.classList.remove('focus-visible');
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('focus-visible');
            }
        });
        
        // Add focus-visible class to focused elements
        document.addEventListener('focusin', function(e) {
            if (document.body.classList.contains('focus-visible')) {
                e.target.classList.add('focus-visible');
            }
        });
        
        document.addEventListener('focusout', function(e) {
            e.target.classList.remove('focus-visible');
        });
    }
    
    // Touch device detection
    function isTouchDevice() {
        return (('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0) ||
               (navigator.msMaxTouchPoints > 0));
    }
    
    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
    }
    
    // Prevent zoom on double-tap for iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Initialize tooltips for accessibility
    const tooltips = document.querySelectorAll('[title]');
    tooltips.forEach(element => {
        element.setAttribute('aria-label', element.getAttribute('title'));
    });
});
