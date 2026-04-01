/**
 * Kunal Das Portfolio - Main JavaScript
 * Enhanced with: TypeWriter, Scroll Progress, Robust Observers, and Smooth Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Core Initializations
    initScrollProgress();
    initTypeWriter();
    initDarkMode();
    initMobileNav();
    initScrollToTop();
    initSmoothScroll();
    initActiveNav();
    initRevealAnimations();
    initContactForm();
    initSkillProgress();
});

/**
 * 1. Scroll Progress Bar
 */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });
}

/**
 * 2. TypeWriter Effect
 */
function initTypeWriter() {
    const heroTitle = document.querySelector('.section-hero h1');
    if (!heroTitle) return;

    // We'll replace the text with a wrapper for the typing effect
    const titles = [
        'Python Developer',
        'Electronics Engineer',
        'IoT Innovator',
        'Full-Stack Developer',
        'Embedded Systems Expert'
    ];
    
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    // Create a span for the text and a span for the cursor
    heroTitle.innerHTML = `<span class="type-text"></span><span class="typing-cursor"></span>`;
    const typeSpan = heroTitle.querySelector('.type-text');

    function type() {
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            charIndex--;
            typeSpeed = 50;
        } else {
            charIndex++;
            typeSpeed = 100;
        }

        typeSpan.textContent = currentTitle.substring(0, charIndex);

        if (!isDeleting && charIndex === currentTitle.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/**
 * 3. Dark Mode Toggle
 */
function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;

    const setTheme = (isDark) => {
        document.body.classList.toggle('dark-theme', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        toggle.checked = isDark;
    };

    // Init from localStorage or System Preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        setTheme(true);
    }

    toggle.addEventListener('change', () => setTheme(toggle.checked));

    // Listen for system changes
    window.matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', e => {
              if (!localStorage.getItem('theme')) setTheme(e.matches);
          });
}

/**
 * 4. Mobile Navigation
 */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('open');
    });

    // Close on link click or outside click
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('open');
        }
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('open');
        });
    });
}

/**
 * 5. Scroll to Top
 */
function initScrollToTop() {
    const btn = document.getElementById('scrollToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * 6. Smooth Scrolling for all links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                const offset = 80; // Navbar height
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = target.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 7. Active Nav Link Highlighting
 */
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-80px 0px -20% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/**
 * 8. Reveal Animations on Scroll
 */
function initRevealAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Optional: Unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.glass-card, .timeline-item, .project-card');
    cards.forEach(card => observer.observe(card));
}

/**
 * 9. Skill Progress Bar Animation
 */
function initSkillProgress() {
    const bars = document.querySelectorAll('.progress-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    bars.forEach(bar => observer.observe(bar));
}

/**
 * 10. Contact Form Simulation
 */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;

        btn.disabled = true;
        btn.textContent = 'Sending...';

        // Simulate API call
        setTimeout(() => {
            btn.textContent = 'Message Sent!';
            form.reset();
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = originalText;
            }, 3000);
        }, 1500);
    });
}
