/**
 * script.js — EmailJS Contact Form Integration
 * ─────────────────────────────────────────────
 * This file handles the "Send Message" form submission
 * using EmailJS (https://www.emailjs.com/) — no backend required.
 *
 * ╔══════════════════════════════════════════════╗
 * ║  HOW TO SET UP (three values to replace)     ║
 * ╠══════════════════════════════════════════════╣
 * ║  1. YOUR_PUBLIC_KEY  → EmailJS Dashboard     ║
 * ║     Account > API Keys > Public Key          ║
 * ║                                              ║
 * ║  2. YOUR_SERVICE_ID  → EmailJS Dashboard     ║
 * ║     Email Services > (your Gmail service)    ║
 * ║     e.g. "service_abc123"                    ║
 * ║                                              ║
 * ║  3. YOUR_TEMPLATE_ID → EmailJS Dashboard     ║
 * ║     Email Templates > (your template)        ║
 * ║     e.g. "template_xyz456"                   ║
 * ║                                              ║
 * ║  Template variables to use inside EmailJS:   ║
 * ║    {{from_name}}  — sender's name            ║
 * ║    {{reply_to}}   — sender's email           ║
 * ║    {{subject}}    — message subject          ║
 * ║    {{message}}    — message body             ║
 * ╚══════════════════════════════════════════════╝
 */

// ─── Step 1: Initialize EmailJS with your Public Key ───────────────────────
// Replace "YOUR_PUBLIC_KEY" with the actual key from your EmailJS account.
emailjs.init("O4tObdHpbPI27O947");   // ← REPLACE THIS

// ─── Step 2: Configuration — update both IDs before going live ────────────
const EMAILJS_SERVICE_ID = "service_wmgxu7m";   // ← REPLACE THIS
const EMAILJS_TEMPLATE_ID = "template_fkvgeje";  // ← REPLACE THIS

// ─── Step 3: DOM references ────────────────────────────────────────────────
const contactForm = document.getElementById("contact-form");
const submitBtn = document.getElementById("contact-submit-btn");

// Guard: exit early if the form element isn't present on this page
if (!contactForm) {
  console.warn("script.js: #contact-form not found — skipping EmailJS setup.");
}

// ─── Step 4: Form submission handler ──────────────────────────────────────
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    // Prevent the default browser form submission (no page reload)
    e.preventDefault();

    // ── 4a. Basic client-side validation ──────────────────────────────────
    const name = document.getElementById("from_name").value.trim();
    const email = document.getElementById("reply_to").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !subject || !message) {
      showAlert("error", "⚠️ Please fill in all fields before sending.");
      return;
    }

    if (!isValidEmail(email)) {
      showAlert("error", "⚠️ Please enter a valid email address.");
      return;
    }

    // ── 4b. Show loading state on the button ──────────────────────────────
    setButtonLoading(true);

    // ── 4c. Build the template parameters object ───────────────────────────
    // These keys must exactly match the {{variables}} in your EmailJS template.
    const templateParams = {
      from_name: name,
      reply_to: email,
      subject: subject,
      message: message,
    };

    // ── 4d. Send the email via EmailJS ────────────────────────────────────
    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(function (response) {
        // ✅ SUCCESS — email sent
        console.log("EmailJS success:", response.status, response.text);

        showAlert(
          "success",
          "✅ Message sent successfully! I'll get back to you soon."
        );

        // Clear the form fields after a successful send
        contactForm.reset();
      })
      .catch(function (error) {
        // ❌ ERROR — log full details to help diagnose
        console.error("EmailJS error object:", error);
        console.error("Status:", error.status);
        console.error("Text:", error.text);

        // Build a human-readable error hint based on the status code
        let hint = "";
        if (error.status === 412) {
          hint = " (Gmail needs re-authorization in EmailJS dashboard)";
        } else if (error.status === 401 || error.status === 403) {
          hint = " (Invalid Public Key or Service ID)";
        } else if (error.status === 404) {
          hint = " (Template ID not found)";
        } else if (error.status === 429) {
          hint = " (Rate limit reached — try again in a minute)";
        }

        const code = error.status ? ` [Code: ${error.status}${hint}]` : "";
        showAlert(
          "error",
          `❌ Failed to send message.${code} Please email me directly at ganeshskl682002@gmail.com`
        );
      })
      .finally(function () {
        // Restore button to its original state regardless of outcome
        setButtonLoading(false);
      });
  });
}

// ─── Helper: email format validation ──────────────────────────────────────
function isValidEmail(email) {
  // Standard RFC-compliant email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Helper: toggle button loading state ──────────────────────────────────
function setButtonLoading(isLoading) {
  if (!submitBtn) return;
  if (isLoading) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    submitBtn.style.opacity = "0.7";
    submitBtn.style.cursor = "not-allowed";
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message →";
    submitBtn.style.opacity = "1";
    submitBtn.style.cursor = "none"; // matches site's custom cursor style
  }
}

// ─── Helper: show a styled toast alert ────────────────────────────────────
/**
 * Displays a dismissible toast notification that matches the portfolio's
 * neon-glassmorphism theme.
 *
 * @param {"success"|"error"} type  - Controls the accent colour
 * @param {string}            text  - The message to display
 */
function showAlert(type, text) {
  // Remove any existing alert first
  const existing = document.getElementById("emailjs-alert");
  if (existing) existing.remove();

  // Colour palette — synced to portfolio CSS variables
  const colors = {
    success: {
      border: "rgba(15, 255, 179, 0.45)",
      glow: "rgba(15, 255, 179, 0.15)",
      icon: "#0fffb3",
    },
    error: {
      border: "rgba(255, 44, 243, 0.45)",
      glow: "rgba(255, 44, 243, 0.12)",
      icon: "#ff2cf3",
    },
  };
  const theme = colors[type] || colors.error;

  // Build the alert element
  const alert = document.createElement("div");
  alert.id = "emailjs-alert";
  alert.setAttribute("role", "alert");
  alert.setAttribute("aria-live", "assertive");

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

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  closeBtn.setAttribute("aria-label", "Dismiss alert");
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
  closeBtn.addEventListener("click", () => dismissAlert(alert));

  // Text node
  const msgSpan = document.createElement("span");
  msgSpan.textContent = text;

  alert.appendChild(msgSpan);
  alert.appendChild(closeBtn);
  document.body.appendChild(alert);

  // Slide in
  requestAnimationFrame(() => {
    alert.style.transform = "translateX(0)";
  });

  // Auto-dismiss after 6 seconds
  setTimeout(() => dismissAlert(alert), 6000);
}

// ─── Helper: slide-out and remove the alert ────────────────────────────────
function dismissAlert(alertEl) {
  if (!alertEl || !alertEl.parentNode) return;
  alertEl.style.transform = "translateX(calc(100% + 2rem))";
  setTimeout(() => {
    if (alertEl.parentNode) alertEl.parentNode.removeChild(alertEl);
  }, 400);
}

// ─── "Hire Me" nav button → smooth scroll to #contact ─────────────────────
const hireMeBtn = document.getElementById("hire-me-btn");
const contactSection = document.getElementById("contact");

if (hireMeBtn && contactSection) {
  hireMeBtn.addEventListener("click", function (e) {
    e.preventDefault(); // stop the default anchor jump

    // Offset by navbar height (~72px) so the heading isn't hidden behind nav
    const navHeight = document.querySelector("nav")
      ? document.querySelector("nav").offsetHeight
      : 72;

    const targetY =
      contactSection.getBoundingClientRect().top +
      window.scrollY -
      navHeight;

    window.scrollTo({ top: targetY, behavior: "smooth" });
  });
}
