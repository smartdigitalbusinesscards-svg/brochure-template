// shared/shared.js
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function isPlaceholder(v) {
    return !v || (typeof v === "string" && v.includes("REPLACE_"));
  }

  function ensureHttp(url) {
    if (!url || typeof url !== "string") return "";
    const u = url.trim();
    if (!u) return "";
    if (/^https?:\/\//i.test(u)) return u;
    // allow mailto/tel/sms to pass through untouched
    if (/^(mailto:|tel:|sms:)/i.test(u)) return u;
    return "https://" + u;
  }

  function sanitizePhoneTel(p) {
    if (!p || typeof p !== "string") return "";
    // keep digits and leading +
    let s = p.trim();
    if (!s) return "";
    s = s.replace(/[^\d+]/g, "");
    // if multiple +, keep only first
    s = s.replace(/\+(?=.+\+)/g, "");
    return s;
  }

  function buildSmsHref(phone, body) {
    const p = sanitizePhoneTel(phone);
    if (!p) return "";

    const msg = (body || "").trim();
    if (!msg) return `sms:${p}`;

    // Cross-device best effort:
    // iOS often likes: sms:number&body=
    // Android commonly supports: sms:number?body=
    // We'll use ?body= which works in many clients; if it fails, user still has the number prefilled.
    const encoded = encodeURIComponent(msg);
    return `sms:${p}?body=${encoded}`;
  }

  ready(function () {
    const B = window.BIZ || {};
    const tier = String(B.tier || "starter").toLowerCase();

    // Set tier on <html> for CSS visibility rules
    document.documentElement.setAttribute("data-tier", tier);

    const qs = (id) => document.getElementById(id);

    const setText = (id, value) => {
      const el = qs(id);
      if (el && value && !isPlaceholder(value)) el.textContent = value;
    };

    const setLink = (id, href, label) => {
      const el = qs(id);
      if (!el) return;

      if (!href || isPlaceholder(href)) {
        el.setAttribute("aria-disabled", "true");
        el.removeAttribute("href");
        return;
      }

      el.setAttribute("href", href);
      el.removeAttribute("aria-disabled");
      if (label && !isPlaceholder(label)) el.textContent = label;
    };

    // Text fields
    setText("company", B.company);
    setText("fullName", B.fullName);
    setText("title", B.title);
    setText("city", B.city);

    const tierBadge = qs("tierBadge");
    if (tierBadge) tierBadge.textContent = tier.charAt(0).toUpperCase() + tier.slice(1);

    // Contact links
    const phoneTel = sanitizePhoneTel(B.phoneTel);

    setLink("callBtn", phoneTel ? `tel:${phoneTel}` : "");
    setLink("textBtn", phoneTel ? buildSmsHref(phoneTel, B.textPrefill) : "");
    setLink("emailBtn", (!isPlaceholder(B.email) && String(B.email).includes("@")) ? `mailto:${String(B.email).trim()}` : "");
    setLink("websiteBtn", !isPlaceholder(B.website) ? ensureHttp(B.website) : "");

    // Booking (show card only if configured)
    const bookingCard = qs("bookingCard");
    const bookingOk = !isPlaceholder(B.bookingLink) && String(B.bookingLink).trim().length > 0;
    if (bookingCard) bookingCard.style.display = bookingOk ? "block" : "none";
    setLink("bookBtn", bookingOk ? ensureHttp(B.bookingLink) : "");

    // Elite CTA (show only if elite tier + configured)
    const eliteOk =
      tier === "elite" &&
      !isPlaceholder(B.eliteCtaUrl) &&
      String(B.eliteCtaUrl).trim().length > 0;

    const eliteWrap = qs("eliteCtaWrap");
    if (eliteWrap) eliteWrap.style.display = eliteOk ? "block" : "none";

    if (eliteOk) {
      setText("eliteCtaTitle", B.eliteCtaTitle);
      setLink("eliteCtaBtn", ensureHttp(B.eliteCtaUrl), B.eliteCtaLabel || "Elite Bonus");
    }
  });
})();
