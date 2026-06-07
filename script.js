/**
 * script.js
 * ─────────────────────────────────────────────
 * 1) EmailJS contact form submission (unchanged functionality)
 * 2) “Hire Me” smooth scroll (unchanged)
 * 3) Mobile hamburger navigation (new)
 *
 * Note:
 * - index.html includes EmailJS via CDN and then loads this file.
 * - EmailJS + nav code are guarded so nothing breaks if elements are missing.
 */

// ─────────────────────────────────────────────
// EmailJS Contact Form Integration
// ─────────────────────────────────────────────

// Initialize EmailJS with your Public Key
emailjs.init('O4tObdHpbPI27O947');

// Configure both IDs before going live
const EMAILJS_SERVICE_ID = 'service_wmgxu7m';
const EMAILJS_TEMPLATE_ID = 'template_fkvgeje';

// DOM references
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('contact-submit-btn');

// Guard: exit early if the form element isn't present on this page
if (!contactForm) {
  console.warn('script.js: #contact-form not found — skipping EmailJS setup.');
}

// Form submission handler
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    // Prevent the default browser form submission (no page reload)
    e.preventDefault();

    // Basic client-side validation
    const name = document.getElementById('from_name').value.trim();
    const email = document.getElementById('reply_to').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
      showAlert('error', '⚠️ Please fill in all fields before sending.');
      return;
    }

    if (!isValidEmail(email)) {
      showAlert('error', '⚠️ Please enter a valid email address.');
      return;
    }

    setButtonLoading(true);

    const templateParams = {
      from_name: name,
      reply_to: email,
      subject: subject,
      message: message,
    };

    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(function (response) {
        console.log('EmailJS success:', response.status, response.text);
        showAlert('success', "✅ Message sent successfully! I'll get back to you soon.");
        contactForm.reset();
      })
      .catch(function (error) {
        console.error('EmailJS error object:', error);
        console.error('Status:', error.status);
        console.error('Text:', error.text);

        let hint = '';
        if (error.status === 412) {
          hint = ' (Gmail needs re-authorization in EmailJS dashboard)';
        } else if (error.status === 401 || error.status === 403) {
          hint = ' (Invalid Public Key or Service ID)';
        } else if (error.status === 404) {
          hint = ' (Template ID not found)';
        } else if (error.status === 429) {
          hint = ' (Rate limit reached — try again in a minute)';
        }

        const code = error.status ? ` [Code: ${error.status}${hint}]` : '';
        showAlert(
          'error',
          `❌ Failed to send message.${code} Please email me directly at ganeshskl682002@gmail.com`
        );
      })
      .finally(function () {
        setButtonLoading(false);
      });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setButtonLoading(isLoading) {
  if (!submitBtn) return;

  if (isLoading) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    submitBtn.style.opacity = '0.7';
    submitBtn.style.cursor = 'not-allowed';
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message →';
    submitBtn.style.opacity = '1';
    submitBtn.style.cursor = 'none';
  }
}

function showAlert(type, text) {
  const existing = document.getElementById('emailjs-alert');
  if (existing) existing.remove();

  const colors = {
    success: {
      border: 'rgba(15, 255, 179, 0.45)',
      glow: 'rgba(15, 255, 179, 0.15)',
    },
    error: {
      border: 'rgba(255, 44, 243, 0.45)',
      glow: 'rgba(255, 44, 243, 0.12)',
    },
  };

  const theme = colors[type] || colors.error;

  const alert = document.createElement('div');
  alert.id = 'emailjs-alert';
  alert.setAttribute('role', 'alert');
  alert.setAttribute('aria-live', 'assertive');

  alert.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 99999;
    max-width: 420px;
    padding: 1.1rem 1.4rem;
    background: rgba(6, 10, 30, 0.92);
    backdrop-filter: blur(24px);
    border: 1px solid ${theme.border};
    box-shadow: 0 0 32px ${theme.glow}, 0 8px 40px rgba(0,0,0,0.5);
    color: #e8f0ff;
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    line-height: 1.7;
    letter-spacing: 0.03em;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    transform: translateX(calc(100% + 2rem));
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  `;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', 'Dismiss alert');
  closeBtn.style.cssText = `
    margin-left: auto;
    background: none;
    border: none;
    color: rgba(180,200,255,0.5);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 0 0 0.5rem;
    line-height: 1;
    flex-shrink: 0;
  `;

  closeBtn.addEventListener('click', () => dismissAlert(alert));

  const msgSpan = document.createElement('span');
  msgSpan.textContent = text;

  alert.appendChild(msgSpan);
  alert.appendChild(closeBtn);
  document.body.appendChild(alert);

  requestAnimationFrame(() => {
    alert.style.transform = 'translateX(0)';
  });

  setTimeout(() => dismissAlert(alert), 6000);
}

function dismissAlert(alertEl) {
  if (!alertEl || !alertEl.parentNode) return;
  alertEl.style.transform = 'translateX(calc(100% + 2rem))';
  setTimeout(() => {
    if (alertEl.parentNode) alertEl.parentNode.removeChild(alertEl);
  }, 400);
}

// ─────────────────────────────────────────────
// “Hire Me” nav button → smooth scroll
// ─────────────────────────────────────────────

const hireMeBtn = document.getElementById('hire-me-btn');
const contactSection = document.getElementById('contact');

if (hireMeBtn && contactSection) {
  hireMeBtn.addEventListener('click', function (e) {
    e.preventDefault();

    const navEl = document.querySelector('nav');
    const navHeight = navEl ? navEl.offsetHeight : 72;

    const targetY =
      contactSection.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetY, behavior: 'smooth' });
  });
}

// ─────────────────────────────────────────────
// Mobile hamburger navigation (new)
// ─────────────────────────────────────────────

(function initMobileNav() {
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (!hamburger || !mobileNav) return;

  const links = mobileNav.querySelectorAll('a');

  function openNav() {
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    if (isOpen) closeNav();
    else openNav();
  });

  links.forEach((a) => {
    a.addEventListener('click', (e) => {
      // Let the anchor jump work (smooth scrolling is handled by CSS scroll-behavior)
      closeNav();
    });
  });

  // Close when clicking outside the nav panel
  document.addEventListener('click', (e) => {
    const isOpen = mobileNav.classList.contains('open');
    if (!isOpen) return;

    const clickedInside = mobileNav.contains(e.target);
    const clickedHamburger = hamburger.contains(e.target);

    if (!clickedInside && !clickedHamburger) closeNav();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeNav();
      hamburger.focus();
    }
  });
})();

