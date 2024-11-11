document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScrollTop = 0;
    let ticking = false;
    let currentLang = 'en';

    // Initial state
    updateHeaderState(0);

    window.addEventListener('scroll', () => {
        lastScrollTop = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHeaderState(lastScrollTop);
                ticking = false;
            });
            ticking = true;
        }
    });

    function updateHeaderState(scrollTop) {
        // Calculate how far user has scrolled as a percentage (max 100)
        const scrollPercentage = Math.min(scrollTop / 50, 1);
        
        // Always keep the header visible
        header.style.position = 'fixed';
        header.style.top = '20px';
        header.style.left = '50%';
        header.style.transform = 'translateX(-50%)';
        header.style.transition = 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
        
        if (scrollTop <= 0) {
            // At the very top
            header.classList.remove('header-floating', 'header-scrolling');
            header.classList.add('header-initial');
            header.style.setProperty('--scroll-progress', '0');
            header.style.width = '100%';
            header.style.borderRadius = '0';
            header.style.boxShadow = 'none';
        } else {
            // Any scroll position
            header.classList.remove('header-initial');
            header.classList.add('header-floating', 'header-scrolling');
            header.style.setProperty('--scroll-progress', scrollPercentage);
            
            // Smooth transition to pill shape
            header.style.borderRadius = `${scrollPercentage * 30}px`;
            header.style.width = `calc(100% - ${scrollPercentage * 40}px)`;
            header.style.maxWidth = '1200px';
            header.style.padding = `${16 - scrollPercentage * 8}px ${24 - scrollPercentage * 4}px`;
            header.style.boxShadow = `0 ${scrollPercentage * 8}px ${scrollPercentage * 16}px rgba(0, 0, 0, ${scrollPercentage * 0.1})`;
        }
    }

    // Language switcher
    window.switchLanguage = function(lang) {
        currentLang = lang;
        navLinks.forEach(link => {
            link.textContent = link.getAttribute(`data-${lang}`);
        });

        // Update any other language-dependent elements
        updateLanguageContent(lang);
    }

    function updateLanguageContent(lang) {
        // Add translations for other elements if needed
        const translations = {
            en: {
                login: 'Login',
                register: 'Register',
                // Add other translations as needed
            },
            es: {
                login: 'Iniciar Sesión',
                register: 'Registrarse',
                // Add other translations as needed
            }
        };

        // Update button text
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }

    // Mobile menu functionality
    window.toggleMobileMenu = function() {
        const body = document.body;
        body.classList.toggle('mobile-menu-open');

        // Add animation classes
        const mobileMenu = document.querySelector('.mobile-menu');
        if (body.classList.contains('mobile-menu-open')) {
            mobileMenu.classList.add('menu-animating');
            setTimeout(() => {
                mobileMenu.classList.remove('menu-animating');
            }, 300);
        }
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        
        if (document.body.classList.contains('mobile-menu-open') &&
            !mobileMenu.contains(e.target) &&
            !mobileMenuButton.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.closest('.input-group').querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Close mobile menu if open
                if (document.body.classList.contains('mobile-menu-open')) {
                    toggleMobileMenu();
                }

                // Smooth scroll to target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle modal interactions
    document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-bs-target');
            const modal = document.querySelector(modalId);
            
            if (modal) {
                // Close mobile menu if open
                if (document.body.classList.contains('mobile-menu-open')) {
                    toggleMobileMenu();
                }
            }
        });
    });

    // Form submissions
    document.getElementById('loginForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add your login form handling here
        console.log('Login form submitted');
    });

    document.getElementById('registerForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add your registration form handling here
        console.log('Register form submitted');
    });

    // Optional: Add resize handler for mobile menu
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Close mobile menu on window resize
            if (window.innerWidth > 768 && document.body.classList.contains('mobile-menu-open')) {
                toggleMobileMenu();
            }
        }, 250);
    });

    // Optional: Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('mobile-menu-open')) {
            toggleMobileMenu();
        }
    });
});

console.log("Header script loaded and executed.");