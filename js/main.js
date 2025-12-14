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
       5. MODALS
       ============================================ */
    
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
        closeModal.addEventListener('click', function() {
            supportModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            supportModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
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
        closePartnerModal.addEventListener('click', function() {
            partnershipModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    if (cancelPartnerBtn) {
        cancelPartnerBtn.addEventListener('click', function() {
            partnershipModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
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
            partnershipModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Reset form
            document.getElementById('partnerName').value = '';
            document.getElementById('partnerEmail').value = '';
            document.getElementById('partnerType').value = '';
            document.getElementById('partnerMessage').value = '';
        });
    }
    
    // Close modal when clicking on backdrop
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', function() {
            this.parentElement.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Copy button functionality
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.getAttribute('data-text');
            
            // Create temporary textarea
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            // Change button text temporarily
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                this.innerHTML = originalHTML;
            }, 2000);
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
       7. REQUEST BANK DETAILS BUTTON
       ============================================ */
    const requestBankBtn = document.getElementById('requestBankBtn');
    const inKindBtn = document.getElementById('inKindBtn');
    
    if (requestBankBtn) {
        requestBankBtn.addEventListener('click', function() {
            window.location.href = 'mailto:info@nzumbifoundation.or.ke?subject=Bank Account Details Request&body=Hello, I would like to receive your bank account details for making a donation.';
        });
    }
    
    if (inKindBtn) {
        inKindBtn.addEventListener('click', function() {
            window.location.href = 'mailto:info@nzumbifoundation.or.ke?subject=In-Kind Support Inquiry&body=Hello, I am interested in providing in-kind support to Nzumbi Foundation.';
        });
    }
    
    /* ============================================
       8. FORM VALIDATION
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
       9. PROGRESS BAR ANIMATION
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
       10. LAZY LOADING IMAGES
       ============================================ */
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src; // Trigger load
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
    
    /* ============================================
       11. BACK TO TOP BUTTON (Optional)
       ============================================ */
    // You can add this if you want a back-to-top button
    /*
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 30px;
        width: 50px;
        height: 50px;
        background: #8806CE;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 998;
    `;
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    */
    
    /* ============================================
       12. CONSOLE MESSAGE
       ============================================ */
    console.log('%cNzumbi Foundation', 'color: #8806CE; font-size: 24px; font-weight: bold;');
    console.log('%cTransforming Communities in Kenya', 'color: #6C757D; font-size: 14px;');
    console.log('%cWebsite developed with ❤️', 'color: #FF6B35; font-size: 12px;');
    
});

/* ============================================
   13. PERFORMANCE OPTIMIZATION
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
    
    // Copy button functionality for M-PESA
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-text');
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show feedback
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                this.classList.add('copied');
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy details. Please select and copy manually.');
            });
        });
    });
    
    // Close modal when clicking on backdrop
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach(backdrop => {
        backdrop.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                modal.style.display = 'none';
            }
        });
    });
});
