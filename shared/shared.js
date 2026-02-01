// shared/shared.js
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function isPlaceholder(v) {
    if (!v) return true;
    if (typeof v !== "string") return false;
    const trimmed = v.trim();
    return trimmed === "" || trimmed.toUpperCase().includes("REPLACE_");
  }

  function ensureHttp(url) {
    if (isPlaceholder(url)) return "";
    const u = String(url).trim();
    if (/^https?:\/\//i.test(u)) return u;
    if (/^(mailto:|tel:|sms:)/i.test(u)) return u;
    return "https://" + u;
  }

  function sanitizePhoneTel(p) {
    if (isPlaceholder(p)) return "";
    let s = String(p).trim().replace(/[^\d+]/g, "");
    s = s.replace(/\+(?=.+\+)/g, ""); // keep only first +
    return s.startsWith("+") ? s : s; // allow international
  }

  function buildSmsHref(phone, body) {
    const p = sanitizePhoneTel(phone);
    if (!p) return "";

    const msg = String(body || "").trim();
    if (isPlaceholder(msg)) return `sms:${p}`;

    const encoded = encodeURIComponent(msg);
    return `sms:\( {p}?body= \){encoded}`;
  }

  ready(function () {
    const B = window.BIZ || {};
    const tier = (String(B.tier || "starter")).toLowerCase().trim();

    document.documentElement.setAttribute("data-tier", tier);

    const qs = (id) => document.getElementById(id);

    const setText = (id, value, fallback = "") => {
      const el = qs(id);
      if (!el) return;
      if (isPlaceholder(value)) {
        el.textContent = fallback;
      } else {
        el.textContent = String(value).trim();
      }
    };

    const setLink = (id, href, label = "", isDisabled = false) => {
      const el = qs(id);
      if (!el) return;

      if (!href || isPlaceholder(href) || isDisabled) {
        el.setAttribute("aria-disabled", "true");
        el.classList.add("disabled");
        el.removeAttribute("href");
        if (label) el.textContent = label || "Not Available";
        return;
      }

      el.setAttribute("href", href);
      el.removeAttribute("aria-disabled");
      el.classList.remove("disabled");
      if (label && !isPlaceholder(label)) el.textContent = label;
    };

    // Text fields (show fallback during dev if placeholder)
    setText("company", B.company, "Company Name");
    setText("fullName", B.fullName, "Your Name");
    setText("title", B.title, "Title");
    setText("city", B.city, "City");

    const tierBadge = qs("tierBadge");
    if (tierBadge) {
      tierBadge.textContent = tier.charAt(0).toUpperCase() + tier.slice(1);
    }

    // Contact links
    const phoneTel = sanitizePhoneTel(B.phoneTel);

    setLink("callBtn", phoneTel ? `tel:${phoneTel}` : "", "Call");
    setLink("textBtn", phoneTel ? buildSmsHref(phoneTel, B.textPrefill) : "", "Text");
    setLink("emailBtn", !isPlaceholder(B.email) && String(B.email).includes("@") ? `mailto:${String(B.email).trim()}` : "", "Email");
    setLink("websiteBtn", !isPlaceholder(B.website) ? ensureHttp(B.website) : "", "Website");

    // Booking
    const bookingOk = !isPlaceholder(B.bookingLink);
    const bookingCard = qs("bookingCard");
    if (bookingCard) bookingCard.style.display = bookingOk ? "block" : "none";
    setLink("bookBtn", bookingOk ? ensureHttp(B.bookingLink) : "", "Schedule Now", !bookingOk);

    // Elite CTA
    const eliteOk = (tier === "elite") && !isPlaceholder(B.eliteCtaUrl);
    const eliteWrap = qs("eliteCtaWrap");
    if (eliteWrap) eliteWrap.style.display = eliteOk ? "block" : "none";

    if (eliteOk) {
      setText("eliteCtaTitle", B.eliteCtaTitle, "Exclusive Offer");
      setLink("eliteCtaBtn", ensureHttp(B.eliteCtaUrl), B.eliteCtaLabel || "Elite Bonus");
    }
  });
})();
