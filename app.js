// 3D Portfolio JavaScript

// Global variables
let particles = [];
let mouseX = 0;
let mouseY = 0;
let isLoaded = false;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

function initializePortfolio() {
    createParticleSystem();
    initializeNavigation();
    initializeScrollAnimations();
    initializeTypingEffect();
    initializeSkillProgressBars();
    initializeTiltEffects();
    initializeContactForm();
    initializeCursorEffects();
    
    // Mark as loaded
    isLoaded = true;
    document.body.classList.add('loaded');
}

// Particle System
function createParticleSystem() {
    const container = document.getElementById('particles-container');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
    
    // Animate particles
    animateParticles();
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size between 2-6px
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation duration
    const duration = Math.random() * 3 + 3;
    particle.style.animationDuration = duration + 's';
    
    // Random delay
    const delay = Math.random() * 2;
    particle.style.animationDelay = delay + 's';
    
    container.appendChild(particle);
    particles.push({
        element: particle,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
    });
}

function animateParticles() {
    particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x <= 0 || particle.x >= window.innerWidth) {
            particle.vx *= -1;
        }
        if (particle.y <= 0 || particle.y >= window.innerHeight) {
            particle.vy *= -1;
        }
        
        // Keep in bounds
        particle.x = Math.max(0, Math.min(window.innerWidth, particle.x));
        particle.y = Math.max(0, Math.min(window.innerHeight, particle.y));
        
        particle.element.style.left = particle.x + 'px';
        particle.element.style.top = particle.y + 'px';
    });
    
    requestAnimationFrame(animateParticles);
}

// Navigation
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Smooth scroll and active link management
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Trigger skill animations when skills section comes into view
                if (entry.target.classList.contains('skills')) {
                    animateSkillProgressBars();
                }
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('section, .about-card, .skill-card, .project-card, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}

// Typing Effect
function initializeTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const text = typingElement.getAttribute('data-text');
    typingElement.textContent = '';
    
    let i = 0;
    const typeSpeed = 80;
    
    function typeWriter() {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, typeSpeed);
        } else {
            // Add blinking cursor
            setTimeout(() => {
                typingElement.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    // Start typing after hero animation
    setTimeout(typeWriter, 1500);
}

// Skill Progress Bars
function initializeSkillProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.setProperty('--progress', progress);
    });
}

function animateSkillProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.animation = 'fillProgress 1.5s ease-out forwards';
        }, index * 100);
    });
}

// 3D Tilt Effects
function initializeTiltEffects() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        element.addEventListener('mouseenter', handleTiltEnter);
        element.addEventListener('mousemove', handleTiltMove);
        element.addEventListener('mouseleave', handleTiltLeave);
    });
}

function handleTiltEnter(e) {
    e.currentTarget.style.transition = 'transform 0.1s ease';
}

function handleTiltMove(e) {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateX = (mouseY / rect.height) * 20;
    const rotateY = (mouseX / rect.width) * -20;
    
    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
}

function handleTiltLeave(e) {
    e.currentTarget.style.transition = 'transform 0.5s ease';
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
}

// Contact Form
// NOTE: Form submission (EmailJS) is handled entirely by script.js.
// This function only wires up the floating-label UX effects for the inputs.
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return; // Guard: form may not exist on every page

    const inputs = form.querySelectorAll('input, textarea');

    // Handle input focus/blur for floating labels
    inputs.forEach(input => {
        input.addEventListener('focus', handleInputFocus);
        input.addEventListener('blur', handleInputBlur);
        input.addEventListener('input', handleInputChange);
    });
}

function handleInputFocus(e) {
    const label = e.target.nextElementSibling;
    if (label && label.classList.contains('floating-label')) {
        label.style.top = '-20px';
        label.style.fontSize = '12px';
        label.style.color = 'var(--color-primary-purple)';
    }
}

function handleInputBlur(e) {
    if (!e.target.value) {
        const label = e.target.nextElementSibling;
        if (label && label.classList.contains('floating-label')) {
            label.style.top = '16px';
            label.style.fontSize = '16px';
            label.style.color = 'var(--color-text-secondary)';
        }
    }
}

function handleInputChange(e) {
    if (e.target.value) {
        const label = e.target.nextElementSibling;
        if (label && label.classList.contains('floating-label')) {
            label.style.top = '-20px';
            label.style.fontSize = '12px';
            label.style.color = 'var(--color-primary-purple)';
        }
    }
}

// Cursor Effects
function initializeCursorEffects() {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update profile image rotation based on mouse position
        const profileImage = document.querySelector('.profile-image');
        if (profileImage) {
            const rect = profileImage.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (mouseX - centerX) / 50;
            const deltaY = (mouseY - centerY) / 50;
            
            profileImage.style.transform = `rotateY(${deltaX}deg) rotateX(${-deltaY}deg)`;
        }
    });
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-glass-bg);
        backdrop-filter: blur(20px);
        border: 1px solid var(--color-glass-border);
        border-radius: var(--radius-base);
        padding: var(--space-4) var(--space-6);
        color: var(--color-text);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Button Ripple Effect
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
        const button = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
        const ripple = button.querySelector('.btn-ripple');
        
        if (ripple) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
        }
    }
});

// Resize handler
window.addEventListener('resize', () => {
    // Update particle system on resize
    particles.forEach(particle => {
        if (particle.x > window.innerWidth) particle.x = window.innerWidth;
        if (particle.y > window.innerHeight) particle.y = window.innerHeight;
    });
});

// Performance optimization: Reduce animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.body.classList.add('reduced-motion');
}

// Preload critical images
function preloadImages() {
    const imageUrls = [
        '/api/placeholder/300/300',
        '/api/placeholder/400/250'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize image preloading
preloadImages();

// Add loading state management
window.addEventListener('load', () => {
    document.body.classList.add('fully-loaded');
    
    // Start hero animations
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.classList.add('animate-in');
    }
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Console easter egg
if (console && console.log) {
    console.log(`
    🚀 Welcome to Alex Developer's Portfolio!
    
    Built with:
    - Pure CSS 3D transforms
    - Vanilla JavaScript
    - Glassmorphism design
    - Particle systems
    - Modern animations
    
    Interested in the code? Check out the GitHub repo!
    `);
}