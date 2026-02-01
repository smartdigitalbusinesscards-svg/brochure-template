// shared/shared.js
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    const B = window.BIZ || {};
    const tier = (B.tier || "starter").toLowerCase();

    // Set tier on <html> for CSS visibility rules
    document.documentElement.setAttribute("data-tier", tier);

    const qs = (id) => document.getElementById(id);

    const setText = (id, value) => {
      const el = qs(id);
      if (el && value) el.textContent = value;
    };

    const setLink = (id, href, label) => {
      const el = qs(id);
      if (!el) return;

      if (!href || href.includes("REPLACE_")) {
        el.setAttribute("aria-disabled", "true");
        el.removeAttribute("href");
        return;
      }

      el.setAttribute("href", href);
      el.removeAttribute("aria-disabled");
      if (label) el.textContent = label;
    };

    // Text fields
    setText("company", B.company);
    setText("fullName", B.fullName);
    setText("title", B.title);
    setText("city", B.city);
    setText("tierBadge", tier.charAt(0).toUpperCase() + tier.slice(1));

    // Contact links
    setLink("callBtn", B.phoneTel ? `tel:${B.phoneTel}` : "");
    setLink("textBtn", B.phoneTel ? `sms:${B.phoneTel}` : "");
    setLink("emailBtn", B.email ? `mailto:${B.email}` : "");
    setLink("websiteBtn", B.website);

    // Booking
    setLink("bookBtn", B.bookingLink);

    // Elite CTA
    if (tier === "elite" && B.eliteCtaUrl && !B.eliteCtaUrl.includes("REPLACE_")) {
      const wrap = qs("eliteCtaWrap");
      if (wrap) wrap.style.display = "block";
      setLink("eliteCtaBtn", B.eliteCtaUrl, B.eliteCtaLabel || "Elite Bonus");
    }
  });
})();
