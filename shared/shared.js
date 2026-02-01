// shared/shared.js
(function () {
  "use strict";

  // --- Safe helpers ---
  const B = (window.BIZ && typeof window.BIZ === "object") ? window.BIZ : {};
  const safe = (v, fallback = "") => {
    if (v === undefined || v === null) return fallback;
    const s = String(v).trim();
    return s.length ? s : fallback;
  };
  const byId = (id) => document.getElementById(id);

  // --- Tier (controls visibility CSS) ---
  const tier = safe(B.tier, "starter").toLowerCase();
  const tierClean = (tier === "pro" || tier === "elite") ? tier : "starter";
  document.documentElement.setAttribute("data-tier", tierClean);
  const tierBadge = byId("tierBadge");
  if (tierBadge) tierBadge.textContent = tierClean.charAt(0).toUpperCase() + tierClean.slice(1);

  // --- Text fields ---
  const company = safe(B.company, "Company Name");
  const fullName = safe(B.fullName, "Your Name");
  const title = safe(B.title, "Title");
  const city = safe(B.city, "City");

  const companyEl = byId("company");
  const fullNameEl = byId("fullName");
  const titleEl = byId("title");
  const cityEl = byId("city");

  if (companyEl) companyEl.textContent = company;
  if (fullNameEl) fullNameEl.textContent = fullName;
  if (titleEl) titleEl.textContent = title;
  if (cityEl) cityEl.textContent = city;

  // --- Link setter (never blank-screen) ---
  function setLink(id, href, label) {
    const a = byId(id);
    if (!a) return;
    if (!href || href.includes("REPLACE_")) {
      a.setAttribute("aria-disabled", "true");
      a.setAttribute("href", "#");
      return;
    }
    a.setAttribute("aria-disabled", "false");
    a.setAttribute("href", href);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
    if (label) a.textContent = label;
  }

  // --- Contact buttons ---
  const phoneTel = safe(B.phoneTel, "");
  const phonePretty = safe(B.phonePretty, "");
  const email = safe(B.email, "");
  const website = safe(B.website, "");

  setLink("callBtn", phoneTel ? ("tel:" + phoneTel) : "", "Call" + (phonePretty ? (" " + phonePretty) : ""));
  setLink("textBtn", phoneTel ? ("sms:" + phoneTel + "?&body=" + encodeURIComponent(safe(B.textPrefill, ""))) : "", "Text");
  setLink("emailBtn", email ? ("mailto:" + email) : "", "Email");
  setLink("websiteBtn", website ? website : "", "Website");

  // --- Booking ---
  const booking = safe(B.bookingLink, "");
  setLink("bookBtn", booking ? booking : "", "Schedule Now");

  // --- Elite CTA (only if elite + provided) ---
  const eliteWrap = byId("eliteCtaWrap");
  const eliteBtn = byId("eliteCtaBtn");
  const eliteLabel = safe(B.eliteCtaLabel, "");
  const eliteUrl = safe(B.eliteCtaUrl, "");

  if (tierClean === "elite" && eliteWrap && eliteBtn && eliteLabel && eliteUrl && !eliteUrl.includes("REPLACE_")) {
    eliteWrap.style.display = "block";
    eliteBtn.textContent = eliteLabel;
    eliteBtn.setAttribute("aria-disabled", "false");
    eliteBtn.setAttribute("href", eliteUrl);
    eliteBtn.setAttribute("target", "_blank");
    eliteBtn.setAttribute("rel", "noopener");
  } else if (eliteWrap) {
    eliteWrap.style.display = "none";
  }
})();
