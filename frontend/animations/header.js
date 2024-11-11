document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScrollTop = 0;
    let ticking = false;

    // Add transition for smooth effects
    header.style.transition = 'backdrop-filter 0.3s ease, background-color 0.3s ease, width 0.3s ease';

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
        const scrollDistance = 200; // Increased from 50 to 200 for a longer effect
        const scrollPercentage = Math.min(scrollTop / scrollDistance, 1);
        
        // Calculate blur and transparency based on scroll
        const blurValue = scrollPercentage * 5; // Will go from 0 to 5px
        const transparency = 0.9 - (scrollPercentage * 0.4); // Will go from 0.9 to 0.5
        
        // Update header styles
        header.style.backdropFilter = `blur(${blurValue}px)`;
        header.style.webkitBackdropFilter = `blur(${blurValue}px)`;
        header.style.backgroundColor = `rgba(250, 244, 235, ${transparency})`;
        
        if (scrollTop <= 0) {
            // At the very top
            header.classList.remove('header-floating');
            header.classList.add('header-initial');
            header.style.setProperty('--scroll-progress', '0');
        } else {
            // Any scroll position
            header.classList.remove('header-initial');
            header.classList.add('header-floating');
            header.style.setProperty('--scroll-progress', scrollPercentage.toString());
        }
    
        // Smooth transition for width
        if (window.innerWidth > 768) {
            const baseWidth = 90; // Base width percentage
            const minWidth = scrollPercentage * 35; // Amount to reduce by when scrolling
            header.style.width = `${baseWidth - minWidth}%`;
        }
    }
    
    // Language switcher
    window.switchLanguage = function(lang) {
        navLinks.forEach(link => {
            link.textContent = link.getAttribute(`data-${lang}`);
        });
    }

    // Mobile menu toggle
    window.toggleMobileMenu = function() {
        document.body.classList.toggle('mobile-menu-open');
    }

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

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        
        if (document.body.classList.contains('mobile-menu-open') &&
            !mobileMenu?.contains(e.target) &&
            !mobileMenuButton?.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // Handle ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('mobile-menu-open')) {
            toggleMobileMenu();
        }
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});