// Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.setAttribute('aria-expanded', mainNav.classList.contains('active'));
        });
    }
    
    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Modal functionality
    const supportModal = document.getElementById('supportModal');
    const donationSupportBtn = document.getElementById('donationSupportBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const closeModal = document.getElementById('closeModal');
    
    if (donationSupportBtn) {
        donationSupportBtn.addEventListener('click', () => {
            supportModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            supportModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            supportModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Partnership Modal
    const partnershipModal = document.getElementById('partnershipModal');
    const partnerBtn = document.getElementById('partnerBtn');
    const closePartnerModal = document.getElementById('closePartnerModal');
    const cancelPartnerBtn = document.getElementById('cancelPartnerBtn');
    
    if (partnerBtn) {
        partnerBtn.addEventListener('click', () => {
            partnershipModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closePartnerModal) {
        closePartnerModal.addEventListener('click', () => {
            partnershipModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (cancelPartnerBtn) {
        cancelPartnerBtn.addEventListener('click', () => {
            partnershipModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
    });
    
    // Copy button functionality
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const text = this.getAttribute('data-text');
            navigator.clipboard.writeText(text).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            });
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Send form data to PHP script
            fetch('send-email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formObject)
            })
            .then(response => response.json())
            .then(data => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show status message
                const formStatus = document.getElementById('formStatus');
                formStatus.className = 'form-status ' + (data.success ? 'success' : 'error');
                formStatus.textContent = data.message;
                formStatus.style.display = 'block';
                
                // Clear form on success
                if (data.success) {
                    contactForm.reset();
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                const formStatus = document.getElementById('formStatus');
                formStatus.className = 'form-status error';
                formStatus.textContent = 'An error occurred. Please try again.';
                formStatus.style.display = 'block';
            });
        });
    }
    
    // Sticky header
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
    
    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .program-card, .support-card').forEach(el => {
        observer.observe(el);
    });
});
