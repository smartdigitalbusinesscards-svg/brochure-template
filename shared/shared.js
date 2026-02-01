// shared/shared.js
(function () {
  // 1) Always set tier on <html> so CSS tier rules can work
  var tier = (window.BIZ && window.BIZ.tier) ? window.BIZ.tier : "starter";
  document.documentElement.setAttribute("data-tier", tier);

  // 2) Helper to safely set text
  function setText(id, value) {
    var el = document.getElementById(id);
    if (el && value != null) el.textContent = value;
  }

  // 3) Helper to safely set links
  function setLink(id, href) {
    var el = document.getElementById(id);
    if (!el) return;
    if (!href) {
      el.setAttribute("aria-disabled", "true");
      el.style.opacity = "0.55";
      el.style.pointerEvents = "none";
      el.removeAttribute("href");
      return;
    }
    el.setAttribute("aria-disabled", "false");
    el.style.opacity = "";
    el.style.pointerEvents = "";
    el.setAttribute("href", href);
  }

  // ---- Fill header ----
  setText("company", window.BIZ && window.BIZ.company);
  setText("fullName", window.BIZ && window.BIZ.fullName);
  setText("title", window.BIZ && window.BIZ.title);
  setText("city", window.BIZ && window.BIZ.city);

  // ---- Buttons ----
  var phoneTel = window.BIZ && window.BIZ.phoneTel;
  var email = window.BIZ && window.BIZ.email;
  var website = window.BIZ && window.BIZ.website;
  var bookingLink = window.BIZ && window.BIZ.bookingLink;

  setLink("callBtn", phoneTel ? ("tel:" + phoneTel) : "");
  setLink("textBtn", phoneTel ? ("sms:" + phoneTel + ((window.BIZ && window.BIZ.textPrefill) ? ("?body=" + encodeURIComponent(window.BIZ.textPrefill)) : "")) : "");
  setLink("emailBtn", email ? ("mailto:" + email) : "");
  setLink("websiteBtn", website || "");
  setLink("bookBtn", bookingLink || "");

  // ---- Elite CTA ----
  var eliteWrap = document.getElementById("eliteCtaWrap");
  var eliteBtn = document.getElementById("eliteCtaBtn");
  if (eliteWrap && eliteBtn && tier === "elite") {
    eliteWrap.style.display = "block";
    eliteBtn.textContent = (window.BIZ && window.BIZ.eliteCtaLabel) ? window.BIZ.eliteCtaLabel : "Elite Bonus";
    setLink("eliteCtaBtn", (window.BIZ && window.BIZ.eliteCtaUrl) ? window.BIZ.eliteCtaUrl : "");
  } else if (eliteWrap) {
    eliteWrap.style.display = "none";
  }

  // ---- Tier badge ----
  setText("tierBadge", tier.charAt(0).toUpperCase() + tier.slice(1));
})();
