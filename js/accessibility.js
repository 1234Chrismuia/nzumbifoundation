// Accessibility Features
document.addEventListener('DOMContentLoaded', function() {
    // Accessibility panel toggle
    const accessibilityToggle = document.getElementById('accessibilityToggle');
    const accessibilityPanel = document.getElementById('accessibilityPanel');
    const closePanel = document.getElementById('closePanel');
    
    if (accessibilityToggle) {
        accessibilityToggle.addEventListener('click', function() {
            accessibilityPanel.classList.toggle('show');
            this.setAttribute('aria-expanded', accessibilityPanel.classList.contains('show'));
        });
    }
    
    if (closePanel) {
        closePanel.addEventListener('click', function() {
            accessibilityPanel.classList.remove('show');
            accessibilityToggle.setAttribute('aria-expanded', 'false');
        });
    }
    
    // Text size controls
    const decreaseText = document.getElementById('decreaseText');
    const resetText = document.getElementById('resetText');
    const increaseText = document.getElementById('increaseText');
    const htmlElement = document.documentElement;
    
    let currentTextSize = 1;
    
    if (decreaseText) {
        decreaseText.addEventListener('click', function() {
            currentTextSize = Math.max(0.85, currentTextSize - 0.15);
            updateTextSize();
        });
    }
    
    if (resetText) {
        resetText.addEventListener('click', function() {
            currentTextSize = 1;
            updateTextSize();
            localStorage.removeItem('textSize');
        });
    }
    
    if (increaseText) {
        increaseText.addEventListener('click', function() {
            currentTextSize = Math.min(1.6, currentTextSize + 0.15);
            updateTextSize();
        });
    }
    
    function updateTextSize() {
        htmlElement.style.fontSize = currentTextSize * 100 + '%';
        localStorage.setItem('textSize', currentTextSize);
    }
    
    // Load saved text size
    const savedTextSize = localStorage.getItem('textSize');
    if (savedTextSize) {
        currentTextSize = parseFloat(savedTextSize);
        updateTextSize();
    }
    
    // High contrast mode
    const toggleContrast = document.getElementById('toggleContrast');
    
    if (toggleContrast) {
        toggleContrast.addEventListener('click', function() {
            document.body.classList.toggle('high-contrast');
            const isActive = document.body.classList.contains('high-contrast');
            this.classList.toggle('active', isActive);
            localStorage.setItem('highContrast', isActive);
        });
        
        // Load saved contrast preference
        const savedContrast = localStorage.getItem('highContrast');
        if (savedContrast === 'true') {
            document.body.classList.add('high-contrast');
            toggleContrast.classList.add('active');
        }
    }
    
    // Speech mode
    const toggleSpeech = document.getElementById('toggleSpeech');
    let speechMode = false;
    let speechSynthesis = window.speechSynthesis;
    
    if (toggleSpeech && speechSynthesis) {
        toggleSpeech.addEventListener('click', function() {
            speechMode = !speechMode;
            this.classList.toggle('active', speechMode);
            
            if (speechMode) {
                enableSpeechMode();
            } else {
                disableSpeechMode();
            }
            
            localStorage.setItem('speechMode', speechMode);
        });
        
        // Load saved speech mode preference
        const savedSpeechMode = localStorage.getItem('speechMode');
        if (savedSpeechMode === 'true') {
            speechMode = true;
            toggleSpeech.classList.add('active');
            enableSpeechMode();
        }
    }
    
    function enableSpeechMode() {
        // Add speech mode classes
        document.body.classList.add('speech-mode');
        
        // Add click handlers for reading
        document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li').forEach(element => {
            element.addEventListener('click', speakElement);
            element.style.cursor = 'pointer';
        });
    }
    
    function disableSpeechMode() {
        // Remove speech mode classes
        document.body.classList.remove('speech-mode');
        
        // Remove click handlers
        document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li').forEach(element => {
            element.removeEventListener('click', speakElement);
            element.style.cursor = '';
        });
        
        // Stop any ongoing speech
        speechSynthesis.cancel();
    }
    
    function speakElement(event) {
        if (!speechMode) return;
        
        const element = event.target;
        const text = element.textContent.trim();
        
        if (text) {
            // Cancel any ongoing speech
            speechSynthesis.cancel();
            
            // Highlight element being read
            const originalBackground = element.style.backgroundColor;
            const originalColor = element.style.color;
            
            element.style.backgroundColor = '#ffff00';
            element.style.color = '#000000';
            
            // Speak the text
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;
            
            utterance.onend = function() {
                element.style.backgroundColor = originalBackground;
                element.style.color = originalColor;
            };
            
            speechSynthesis.speak(utterance);
        }
    }
    
    // Keyboard navigation for accessibility panel
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && accessibilityPanel.classList.contains('show')) {
            accessibilityPanel.classList.remove('show');
            accessibilityToggle.setAttribute('aria-expanded', 'false');
        }
        
        // Ctrl + Alt + A to open accessibility panel
        if (e.ctrlKey && e.altKey && e.key === 'a') {
            e.preventDefault();
            accessibilityPanel.classList.toggle('show');
            accessibilityToggle.setAttribute('aria-expanded', accessibilityPanel.classList.contains('show'));
        }
        
        // Ctrl + Alt + C to toggle contrast
        if (e.ctrlKey && e.altKey && e.key === 'c') {
            e.preventDefault();
            if (toggleContrast) {
                toggleContrast.click();
            }
        }
    });
    
    // Focus trap for accessibility panel
    if (accessibilityPanel) {
        const focusableElements = accessibilityPanel.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
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
    
    // Announce dynamic content changes for screen readers
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
    }
    
    // Expose announce function globally for other scripts
    window.announceToScreenReader = announceToScreenReader;
});
