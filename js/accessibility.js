/* ============================================
   NZUMBI FOUNDATION - ACCESSIBILITY JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    /* ============================================
       1. ACCESSIBILITY PANEL TOGGLE
       ============================================ */
    const accessibilityToggle = document.getElementById('accessibilityToggle');
    const accessibilityPanel = document.getElementById('accessibilityPanel');
    const closePanel = document.getElementById('closePanel');
    
    if (accessibilityToggle) {
        accessibilityToggle.addEventListener('click', function() {
            accessibilityPanel.classList.toggle('active');
        });
    }
    
    if (closePanel) {
        closePanel.addEventListener('click', function() {
            accessibilityPanel.classList.remove('active');
        });
    }
    
    // Close panel when clicking outside
    document.addEventListener('click', function(e) {
        const widget = document.querySelector('.accessibility-widget');
        if (widget && !widget.contains(e.target)) {
            accessibilityPanel.classList.remove('active');
        }
    });
    
    /* ============================================
       2. TEXT SIZE CONTROLS
       ============================================ */
    const decreaseText = document.getElementById('decreaseText');
    const resetText = document.getElementById('resetText');
    const increaseText = document.getElementById('increaseText');
    
    let currentSize = 'normal';
    const sizes = ['small', 'normal', 'large', 'xlarge'];
    let sizeIndex = 1; // Start at normal
    
    // Load saved text size preference
    const savedSize = localStorage.getItem('textSize');
    if (savedSize) {
        document.body.className = document.body.className.replace(/text-size-\w+/g, '');
        document.body.classList.add('text-size-' + savedSize);
        sizeIndex = sizes.indexOf(savedSize);
    }
    
    if (decreaseText) {
        decreaseText.addEventListener('click', function() {
            if (sizeIndex > 0) {
                sizeIndex--;
                updateTextSize(sizes[sizeIndex]);
            }
        });
    }
    
    if (resetText) {
        resetText.addEventListener('click', function() {
            sizeIndex = 1; // Reset to normal
            updateTextSize('normal');
        });
    }
    
    if (increaseText) {
        increaseText.addEventListener('click', function() {
            if (sizeIndex < sizes.length - 1) {
                sizeIndex++;
                updateTextSize(sizes[sizeIndex]);
            }
        });
    }
    
    function updateTextSize(size) {
        // Remove all text size classes
        document.body.className = document.body.className.replace(/text-size-\w+/g, '');
        // Add new size class
        document.body.classList.add('text-size-' + size);
        // Save preference
        localStorage.setItem('textSize', size);
    }
    
    /* ============================================
       3. HIGH CONTRAST MODE
       ============================================ */
    const toggleContrast = document.getElementById('toggleContrast');
    
    // Load saved contrast preference
    const savedContrast = localStorage.getItem('highContrast');
    if (savedContrast === 'true') {
        document.body.classList.add('high-contrast');
        toggleContrast.classList.add('active');
    }
    
    if (toggleContrast) {
        toggleContrast.addEventListener('click', function() {
            this.classList.toggle('active');
            document.body.classList.toggle('high-contrast');
            
            // Save preference
            const isActive = document.body.classList.contains('high-contrast');
            localStorage.setItem('highContrast', isActive);
        });
    }
    
    /* ============================================
       4. SPEECH/READ ALOUD MODE
       ============================================ */
    const toggleSpeech = document.getElementById('toggleSpeech');
    let speechEnabled = false;
    let currentUtterance = null;
    
    // Check if browser supports speech synthesis
    const speechSupported = 'speechSynthesis' in window;
    
    if (!speechSupported && toggleSpeech) {
        toggleSpeech.disabled = true;
        toggleSpeech.title = 'Speech synthesis not supported in this browser';
    }
    
    if (toggleSpeech && speechSupported) {
        toggleSpeech.addEventListener('click', function() {
            this.classList.toggle('active');
            speechEnabled = !speechEnabled;
            
            if (speechEnabled) {
                document.body.classList.add('speech-mode');
                enableSpeechMode();
            } else {
                document.body.classList.remove('speech-mode');
                disableSpeechMode();
                // Stop any ongoing speech
                window.speechSynthesis.cancel();
            }
        });
    }
    
    function enableSpeechMode() {
        // Add click listeners to all text elements
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, a, button, label');
        
        textElements.forEach(element => {
            element.addEventListener('click', speakText);
            element.style.cursor = 'pointer';
            element.title = 'Click to read aloud';
        });
    }
    
    function disableSpeechMode() {
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, a, button, label');
        
        textElements.forEach(element => {
            element.removeEventListener('click', speakText);
            element.style.cursor = '';
            element.title = '';
        });
    }
    
    function speakText(e) {
        if (!speechEnabled) return;
        
        // Don't speak if clicking on interactive elements in normal mode
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
            e.preventDefault();
        }
        
        // Stop any ongoing speech
        window.speechSynthesis.cancel();
        
        // Get text content
        const text = e.target.textContent.trim();
        
        if (text) {
            // Create utterance
            currentUtterance = new SpeechSynthesisUtterance(text);
            
            // Set voice properties
            currentUtterance.rate = 0.9; // Slightly slower
            currentUtterance.pitch = 1;
            currentUtterance.volume = 1;
            
            // Highlight element while speaking
            e.target.classList.add('speaking');
            
            currentUtterance.onend = function() {
                e.target.classList.remove('speaking');
            };
            
            // Speak
            window.speechSynthesis.speak(currentUtterance);
        }
    }
    
    /* ============================================
       5. KEYBOARD NAVIGATION ENHANCEMENT
       ============================================ */
    
    // Add visible focus indicators
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });
    
    /* ============================================
       6. SKIP LINKS
       ============================================ */
    const skipLinks = document.querySelectorAll('.skip-to-content');
    
    skipLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    /* ============================================
       7. ARIA LIVE REGIONS FOR DYNAMIC CONTENT
       ============================================ */
    
    // Create a live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
    
    // Function to announce messages to screen readers
    window.announceToScreenReader = function(message) {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    };
    
    /* ============================================
       8. FORM ACCESSIBILITY ENHANCEMENTS
       ============================================ */
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Add aria-required to required fields
            if (input.hasAttribute('required')) {
                input.setAttribute('aria-required', 'true');
            }
            
            // Add aria-invalid for validation
            input.addEventListener('invalid', function() {
                this.setAttribute('aria-invalid', 'true');
            });
            
            input.addEventListener('input', function() {
                if (this.validity.valid) {
                    this.setAttribute('aria-invalid', 'false');
                }
            });
        });
        
        // Announce form submission status
        form.addEventListener('submit', function() {
            window.announceToScreenReader('Form is being submitted');
        });
    });
    
    /* ============================================
       9. MODAL ACCESSIBILITY
       ============================================ */
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        // Set ARIA attributes
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        
        // Trap focus within modal when open
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && this.classList.contains('active')) {
                this.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            // Trap Tab key
            if (e.key === 'Tab' && this.classList.contains('active')) {
                trapFocus(e, this);
            }
        });
    });
    
    function trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
    
    /* ============================================
       10. IMAGE ALT TEXT CHECKER (Development Only)
       ============================================ */
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('alt')) {
                console.warn('Image missing alt text:', img);
                img.style.border = '2px solid red';
            }
        });
    }
    
    /* ============================================
       11. HEADING HIERARCHY CHECKER (Development Only)
       ============================================ */
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.substring(1));
            
            if (level - lastLevel > 1) {
                console.warn('Heading hierarchy skipped:', heading, 'Previous level:', lastLevel, 'Current level:', level);
            }
            
            lastLevel = level;
        });
    }
    
    /* ============================================
       12. PREFERS-REDUCED-MOTION DETECTION
       ============================================ */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        console.log('User prefers reduced motion');
        // Add class to body
        document.body.classList.add('reduced-motion');
    }
    
    prefersReducedMotion.addEventListener('change', function() {
        if (this.matches) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
    });
    
    /* ============================================
       13. COLOR SCHEME DETECTION
       ============================================ */
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (prefersDarkMode.matches) {
        console.log('User prefers dark mode');
        // You can add dark mode styles if desired
    }
    
    /* ============================================
       14. TOOLTIP ACCESSIBILITY
       ============================================ */
    const tooltips = document.querySelectorAll('[title]');
    
    tooltips.forEach(element => {
        const title = element.getAttribute('title');
        element.setAttribute('aria-label', title);
    });
    
    /* ============================================
       15. ANNOUNCE PAGE LOAD
       ============================================ */
    window.addEventListener('load', function() {
        setTimeout(() => {
            window.announceToScreenReader('Page loaded. Nzumbi Foundation website. Use Tab to navigate.');
        }, 1000);
    });
    
});

/* ============================================
   16. UTILITY FUNCTIONS
   ============================================ */

// Function to check if element is visible
function isElementVisible(element) {
    return element.offsetWidth > 0 && element.offsetHeight > 0;
}

// Function to get focusable elements
function getFocusableElements(container) {
    return container.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
}

// Function to check color contrast (for development)
function checkContrast(foreground, background) {
    // This is a simplified version
    // For production, use a proper color contrast library
    const getLuminance = (color) => {
        // Simplified luminance calculation
        return (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;
    };
    
    const fgLum = getLuminance(foreground);
    const bgLum = getLuminance(background);
    
    const contrast = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
    
    return contrast;
}
