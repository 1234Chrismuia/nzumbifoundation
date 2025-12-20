/* ============================================
   NZUMBI FOUNDATION - MAIN JAVASCRIPT
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    
    /* ============================================
       1. HEADER SCROLL EFFECT
       ============================================ */
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    /* ============================================
       2. MOBILE MENU TOGGLE
       ============================================ */
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            
            // Change icon
            const icon = this.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    /* ============================================
       3. SMOOTH SCROLLING
       ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip empty anchors and javascript: links
            if (href === '#' || href.startsWith('javascript:')) {
                return;
            }
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    /* ============================================
       4. SCROLL ANIMATIONS
       ============================================ */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    // Observe elements with scroll-animate class
    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
    
    // Add scroll-animate class to sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('scroll-animate');
    });
    
    /* ============================================
       5. MODALS - CLOSE ON OUTSIDE CLICK
       ============================================ */
    
    // Function to close all modals
    function closeAllModals() {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Support/Donation Modal
    const supportModal = document.getElementById('supportModal');
    const donationSupportBtn = document.getElementById('donationSupportBtn');
    const closeModal = document.getElementById('closeModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    if (donationSupportBtn) {
        donationSupportBtn.addEventListener('click', function() {
            supportModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closeAllModals);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeAllModals);
    }
    
    // Partnership Modal
    const partnershipModal = document.getElementById('partnershipModal');
    const partnerBtn = document.getElementById('partnerBtn');
    const closePartnerModal = document.getElementById('closePartnerModal');
    const cancelPartnerBtn = document.getElementById('cancelPartnerBtn');
    const submitPartnerBtn = document.getElementById('submitPartnerBtn');
    
    if (partnerBtn) {
        partnerBtn.addEventListener('click', function() {
            partnershipModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closePartnerModal) {
        closePartnerModal.addEventListener('click', closeAllModals);
    }
    
    if (cancelPartnerBtn) {
        cancelPartnerBtn.addEventListener('click', closeAllModals);
    }
    
    // Submit Partnership Form
    if (submitPartnerBtn) {
        submitPartnerBtn.addEventListener('click', function() {
            const name = document.getElementById('partnerName').value;
            const email = document.getElementById('partnerEmail').value;
            const type = document.getElementById('partnerType').value;
            const message = document.getElementById('partnerMessage').value;
            
            if (!name || !email || !type || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // You can add AJAX submission here
            alert('Thank you for your partnership inquiry! We will contact you soon.');
            closeAllModals();
            
            // Reset form
            document.getElementById('partnerName').value = '';
            document.getElementById('partnerEmail').value = '';
            document.getElementById('partnerType').value = '';
            document.getElementById('partnerMessage').value = '';
        });
    }
    
    // Close modal when clicking on backdrop (outside modal content)
    document.querySelectorAll('.modal-backdrop, .modal').forEach(modalElement => {
        modalElement.addEventListener('click', function(e) {
            // Check if click is on backdrop or directly on modal container (outside content)
            if (e.target.classList.contains('modal-backdrop') || 
                (e.target.classList.contains('modal') && !e.target.querySelector('.modal-container'))) {
                closeAllModals();
            }
        });
    });
    
    // Close modal when clicking outside modal content but inside modal
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeAllModals();
            }
        });
    });
    
    /* ============================================
       6. CONTACT FORM SUBMISSION
       ============================================ */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Send form data via AJAX
            fetch('send_email.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    formStatus.className = 'form-status success';
                    formStatus.innerHTML = '<i class="fas fa-check-circle"></i> ' + data.message;
                    contactForm.reset();
                } else {
                    formStatus.className = 'form-status error';
                    formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + data.message;
                }
                
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Hide status after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            })
            .catch(error => {
                console.error('Error:', error);
                formStatus.className = 'form-status error';
                formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> An error occurred. Please try again.';
                
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
    
    /* ============================================
       7. FORM VALIDATION
       ============================================ */
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateInput(this);
                }
            });
        });
    });
    
    function validateInput(input) {
        if (!input.value.trim()) {
            input.classList.add('error');
            input.style.borderColor = '#DC3545';
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            input.classList.add('error');
            input.style.borderColor = '#DC3545';
        } else {
            input.classList.remove('error');
            input.style.borderColor = '#8806CE';
        }
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    /* ============================================
       8. PROGRESS BAR ANIMATION
       ============================================ */
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0%';
                
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
                
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
    
    /* ============================================
       9. CONSOLE MESSAGE
       ============================================ */
    console.log('%cNzumbi Foundation', 'color: #8806CE; font-size: 24px; font-weight: bold;');
    console.log('%cTransforming Communities in Kenya', 'color: #6C757D; font-size: 14px;');
    console.log('%cWebsite developed with ❤️', 'color: #FF6B35; font-size: 12px;');
    
    /* ============================================
       10. CLOSE MODALS ON ESCAPE KEY
       ============================================ */
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
});

/* ============================================
   11. PERFORMANCE OPTIMIZATION
   ============================================ */
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for resize events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Function to scroll to contact form and pre-fill subject
function scrollToContactForm(subject) {
    // Close any open modals
    const supportModal = document.getElementById('supportModal');
    const partnerModal = document.getElementById('partnershipModal');
    
    if (supportModal) {
        supportModal.classList.remove('active');
        supportModal.style.display = 'none';
    }
    
    if (partnerModal) {
        partnerModal.classList.remove('active');
        partnerModal.style.display = 'none';
    }
    
    // Store the subject in sessionStorage
    sessionStorage.setItem('contactSubject', subject);
    
    // Scroll to the contact form section
    const donateSection = document.getElementById('donate');
    if (donateSection) {
        donateSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Wait a bit for scroll to complete, then set the subject
    setTimeout(() => {
        const subjectSelect = document.getElementById('subject');
        if (subjectSelect) {
            // Check if the subject exists in options, otherwise add it
            let optionExists = false;
            for (let i = 0; i < subjectSelect.options.length; i++) {
                if (subjectSelect.options[i].value === subject) {
                    optionExists = true;
                    break;
                }
            }
            
            if (!optionExists) {
                // Add a new option for this custom subject
                const newOption = new Option(subject, subject);
                subjectSelect.add(newOption);
            }
            
            subjectSelect.value = subject;
            
            // Focus on the message field for better UX
            const messageField = document.getElementById('message');
            if (messageField) {
                messageField.focus();
                messageField.value = "I would like to discuss: " + subject + "\n\n";
            }
        }
    }, 800);
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // MODAL TOGGLE FUNCTIONS
    const supportModal = document.getElementById('supportModal');
    const partnershipModal = document.getElementById('partnershipModal');
    
    // Show donation modal
    const donationSupportBtn = document.getElementById('donationSupportBtn');
    if (donationSupportBtn) {
        donationSupportBtn.addEventListener('click', function() {
            if (supportModal) {
                supportModal.classList.add('active');
                supportModal.style.display = 'block';
            }
        });
    }
    
    // Show partnership modal
    const partnerBtn = document.getElementById('partnerBtn');
    if (partnerBtn) {
        partnerBtn.addEventListener('click', function() {
            if (partnershipModal) {
                partnershipModal.classList.add('active');
                partnershipModal.style.display = 'block';
            }
        });
    }
    
    // Close modals
    const closeModalBtns = document.querySelectorAll('.close-modal, #closeModalBtn');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (supportModal) {
                supportModal.classList.remove('active');
                supportModal.style.display = 'none';
            }
            if (partnershipModal) {
                partnershipModal.classList.remove('active');
                partnershipModal.style.display = 'none';
            }
        });
    });
    
    // Close partner modal
    const closePartnerModal = document.getElementById('closePartnerModal');
    const cancelPartnerBtn = document.getElementById('cancelPartnerBtn');
    
    if (closePartnerModal) {
        closePartnerModal.addEventListener('click', function() {
            if (partnershipModal) {
                partnershipModal.classList.remove('active');
                partnershipModal.style.display = 'none';
            }
        });
    }
    
    if (cancelPartnerBtn) {
        cancelPartnerBtn.addEventListener('click', function() {
            if (partnershipModal) {
                partnershipModal.classList.remove('active');
                partnershipModal.style.display = 'none';
            }
        });
    }
    
    // Add click handlers to request contact buttons in the modal
    const requestContactBtns = document.querySelectorAll('.request-contact-btn');
    requestContactBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const subject = this.getAttribute('data-subject');
            scrollToContactForm(subject);
        });
    });
    
    // Handle "Make a Donation" button in the modal that should go to contact form
    const modalDonateBtn = document.querySelector('.modal .btn-primary');
    if (modalDonateBtn) {
        modalDonateBtn.addEventListener('click', function() {
            scrollToContactForm('Donation Inquiry');
        });
    }
    
    // Check for stored subject on page load
    const storedSubject = sessionStorage.getItem('contactSubject');
    if (storedSubject) {
        const subjectSelect = document.getElementById('subject');
        if (subjectSelect) {
            // Check if the subject exists in options, otherwise add it
            let optionExists = false;
            for (let i = 0; i < subjectSelect.options.length; i++) {
                if (subjectSelect.options[i].value === storedSubject) {
                    optionExists = true;
                    break;
                }
            }
            
            if (!optionExists) {
                // Add a new option for this custom subject
                const newOption = new Option(storedSubject, storedSubject);
                subjectSelect.add(newOption);
            }
            
            subjectSelect.value = storedSubject;
            sessionStorage.removeItem('contactSubject'); // Clear after use
        }
    }
});

// ============================================
// MODERN BLOG & NEWS FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // FILTER FUNCTIONALITY
    // ============================================ */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.modern-blog-card');
    const heroPost = document.querySelector('.hero-post');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter blog cards with smooth animation
            blogCards.forEach((card, index) => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    // Show card with delay for staggered effect
                    setTimeout(() => {
                        card.classList.remove('hidden');
                        card.style.animation = 'fadeInUp 0.5s ease forwards';
                    }, index * 50);
                } else {
                    // Hide card
                    card.style.animation = 'fadeOut 0.3s ease forwards';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
            
            // Filter hero post
            if (heroPost) {
                const heroCategory = heroPost.getAttribute('data-category');
                if (filterValue === 'all' || heroCategory === filterValue) {
                    heroPost.style.display = 'grid';
                    heroPost.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    heroPost.style.animation = 'fadeOut 0.3s ease forwards';
                    setTimeout(() => {
                        heroPost.style.display = 'none';
                    }, 300);
                }
            }
        });
    });
    
    // ============================================
    // BLOG MODAL FUNCTIONALITY - WITH OUTSIDE CLICK CLOSE
    // ============================================
    const blogModal = document.getElementById('blogModal');
    const readMoreButtons = document.querySelectorAll('.read-more-btn, .card-read-more');
    const closeBlogModal = document.getElementById('closeBlogModal');
    
    // Function to close blog modal
    function closeBlogModalFunc() {
        if (blogModal) {
            blogModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Open modal
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (blogModal) {
                blogModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Smooth scroll to top of modal
                setTimeout(() => {
                    const modalContent = blogModal.querySelector('.blog-modal-content');
                    if (modalContent) {
                        modalContent.scrollTop = 0;
                    }
                }, 100);
            }
        });
    });
    
    // Close modal with close button
    if (closeBlogModal) {
        closeBlogModal.addEventListener('click', closeBlogModalFunc);
    }
    
    // Close modal on backdrop click
    if (blogModal) {
        const backdrop = blogModal.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', closeBlogModalFunc);
        }
        
        // Also close when clicking directly on modal container (outside content)
        blogModal.addEventListener('click', function(e) {
            if (e.target === this || e.target.classList.contains('modal-container')) {
                closeBlogModalFunc();
            }
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && blogModal && blogModal.classList.contains('active')) {
            closeBlogModalFunc();
        }
    });
    
    // ============================================
    // GALLERY LIGHTBOX - WITH OUTSIDE CLICK CLOSE
    // ============================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.querySelector('.gallery-content');
            
            if (img) {
                createLightbox(
                    img.src,
                    img.alt,
                    caption ? caption.innerHTML : img.alt
                );
            }
        });
    });
    
    // Lightbox creation function
    function createLightbox(imageSrc, imageAlt, caption) {
        // Remove existing lightbox if any
        const existingLightbox = document.querySelector('.lightbox');
        if (existingLightbox) {
            existingLightbox.remove();
        }
        
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.style.animation = 'fadeIn 0.3s ease';
        
        lightbox.innerHTML = `
            <div class="lightbox-content" style="animation: scaleIn 0.3s ease">
                <button class="close-lightbox" aria-label="Close lightbox">
                    <i class="fas fa-times"></i>
                </button>
                <img src="${imageSrc}" alt="${imageAlt}">
                <div class="lightbox-caption">${caption}</div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Function to close lightbox
        function closeLightboxFunc() {
            lightbox.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                lightbox.remove();
                document.body.style.overflow = '';
            }, 300);
        }
        
        // Close lightbox with button
        const closeLightbox = lightbox.querySelector('.close-lightbox');
        closeLightbox.addEventListener('click', closeLightboxFunc);
        
        // Close on backdrop click
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightboxFunc();
            }
        });
        
        // Close on Escape key
        const escapeHandler = function(e) {
            if (e.key === 'Escape') {
                closeLightboxFunc();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    // ============================================
    // CARD HOVER EFFECTS
    // ============================================
    const cards = document.querySelectorAll('.modern-blog-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle parallax effect to image
            const img = this.querySelector('.card-image-wrapper img');
            if (img) {
                img.style.transform = 'scale(1.15) translateY(-5px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const img = this.querySelector('.card-image-wrapper img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
    });
    
    // ============================================
    // VIEW ALL GALLERY BUTTON
    // ============================================
    const viewAllBtn = document.querySelector('.view-all-gallery');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            // Could open a modal with all gallery images
            // For now, just scroll to gallery
            const gallery = document.querySelector('.interactive-gallery');
            if (gallery) {
                gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    // ============================================
    // LAZY LOADING FOR IMAGES
    // ============================================
    const images = document.querySelectorAll('.modern-blog-card img, .gallery-item img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';
                
                // Once image loads, fade it in
                if (img.complete) {
                    img.style.opacity = '1';
                } else {
                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                    });
                }
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // ============================================
    // ANIMATIONS
    // ============================================
    // Add animation keyframes to document
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes scaleIn {
            from {
                transform: scale(0.9);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        /* Lightbox Styles */
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            padding: 40px;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .lightbox-content img {
            max-width: 100%;
            max-height: 70vh;
            object-fit: contain;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        
        .close-lightbox {
            position: absolute;
            top: -50px;
            right: 0;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: none;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            color: white;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .close-lightbox:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: rotate(90deg);
        }
        
        .lightbox-caption {
            color: white;
            text-align: center;
            padding: 20px;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            margin-top: 20px;
            max-width: 600px;
        }
        
        .lightbox-caption h4 {
            color: white;
            margin: 0 0 8px 0;
            font-size: 20px;
        }
        
        .lightbox-caption p {
            color: rgba(255, 255, 255, 0.9);
            margin: 0;
            font-size: 14px;
        }
        
        @media (max-width: 768px) {
            .lightbox {
                padding: 20px;
            }
            
            .lightbox-content img {
                max-height: 60vh;
            }
        }
    `;
    document.head.appendChild(animationStyles);
    
    console.log('Modern Blog & News functionality initialized');
});
