(function () {
  "use strict";

  const B = window.BIZ || {};
  const tier = String(B.tier || "starter").toLowerCase();

  const qs = (id) => document.getElementById(id);
  const isPlaceholder = (v) =>
    !v || String(v).toUpperCase().includes("REPLACE_");

  const setText = (id, val) => {
    const el = qs(id);
    if (el && !isPlaceholder(val)) el.textContent = val;
  };

  const setLink = (id, href) => {
    const el = qs(id);
    if (!el) return;
    if (!href || isPlaceholder(href)) {
      el.classList.add("disabled");
      el.setAttribute("aria-disabled", "true");
      return;
    }
    el.href = href;
    el.classList.remove("disabled");
    el.removeAttribute("aria-disabled");
  };

  // Header
  setText("company", B.company);
  setText("fullName", B.fullName);
  setText("title", B.title);
  setText("city", B.city);
  qs("tierBadge").textContent = tier[0].toUpperCase() + tier.slice(1);

  // Contact
  setLink("callBtn", B.phoneTel ? `tel:${B.phoneTel}` : "");
  setLink(
    "textBtn",
    B.phoneTel
      ? `sms:${B.phoneTel}?body=${encodeURIComponent(B.textPrefill || "")}`
      : ""
  );
  setLink("emailBtn", B.email ? `mailto:${B.email}` : "");
  setLink(
    "websiteBtn",
    B.website ? (B.website.startsWith("http") ? B.website : "https://" + B.website) : ""
  );

  // Booking
  if (!isPlaceholder(B.bookingLink)) {
    qs("bookingCard").style.display = "block";
    setLink("bookBtn", B.bookingLink);
  }

  // Tier sections
  if (tier === "pro" || tier === "elite") {
    document.querySelector('[data-tier="pro"]').style.display = "block";
  }
  if (tier === "elite") {
    document.querySelector('[data-tier="elite"]').style.display = "block";
    if (!isPlaceholder(B.eliteCtaUrl)) {
      qs("eliteCtaWrap").style.display = "block";
      setText("eliteCtaTitle", B.eliteCtaTitle);
      setLink("eliteCtaBtn", B.eliteCtaUrl);
    }
  }
})();
