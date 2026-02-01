// shared/shared.js
(function () {
  "use strict";

  function ready(fn){
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function isPlaceholder(v){
    if (v === null || v === undefined) return true;
    const s = String(v).trim();
    return s === "" || s.toUpperCase().includes("REPLACE_");
  }

  function ensureHttp(url){
    if (isPlaceholder(url)) return "";
    const u = String(url).trim();
    if (/^https?:\/\//i.test(u)) return u;
    if (/^(mailto:|tel:|sms:)/i.test(u)) return u;
    return "https://" + u;
  }

  function sanitizePhoneTel(p){
    if (isPlaceholder(p)) return "";
    let s = String(p).trim().replace(/[^\d+]/g, "");
    s = s.replace(/\+(?=.+\+)/g, "");
    return s;
  }

  function buildSmsHref(phone, body){
    const p = sanitizePhoneTel(phone);
    if (!p) return "";
    const msg = String(body || "").trim();
    if (!msg) return `sms:${p}`;
    return `sms:${p}?body=${encodeURIComponent(msg)}`;
  }

  function setText(id, value){
    const el = document.getElementById(id);
    if (!el) return;
    if (!isPlaceholder(value)) el.textContent = String(value);
  }

  function setImage(id, src){
    const el = document.getElementById(id);
    if (!el) return;
    if (!isPlaceholder(src)) el.setAttribute("src", String(src));
  }

  function setLink(id, href, label){
    const el = document.getElementById(id);
    if (!el) return;

    if (!href || isPlaceholder(href)) {
      el.setAttribute("aria-disabled", "true");
      el.removeAttribute("href");
      if (label) el.textContent = label;
      return;
    }

    el.setAttribute("href", href);
    el.removeAttribute("aria-disabled");
    if (label && !isPlaceholder(label)) el.textContent = label;
  }

  function showTierSections(tier){
  const showPro = (tier === "pro" || tier === "elite");
  const showElite = (tier === "elite");

  const show = (el) => {
    const tag = (el.tagName || "").toLowerCase();
    // badges + divs should be inline-flex-ish; list items should be flex
    if (tag === "li") el.style.display = "flex";
    else el.style.display = "inline-flex";
  };

  document.querySelectorAll('[data-tier="pro"]').forEach(el=>{
    if (showPro) show(el);
    else el.style.display = "none";
  });

  document.querySelectorAll('[data-tier="elite"]').forEach(el=>{
    if (showElite) show(el);
    else el.style.display = "none";
  });
}

  ready(function () {
    const B = window.BIZ || {};
    // URL tier override: ?tier=starter|pro|elite
const urlTier = new URL(window.location.href).searchParams.get("tier");
const tier = String(urlTier || B.tier || "starter").toLowerCase().trim();

    // Tier badge text
    const tierBadge = document.getElementById("tierBadge");
    if (tierBadge) tierBadge.textContent = tier.charAt(0).toUpperCase() + tier.slice(1);

    // Header
    setText("kicker", B.company);
    setText("headline", B.headline);

    // Subline pill
    const sub = [B.fullName, B.title, B.city].filter(v => !isPlaceholder(v)).join(" · ");
    if (sub) setText("sublinePill", sub);

    // Badges
    if (Array.isArray(B.badges)) {
      const ids = ["badge1","badge2","badge3","badge4"];
      ids.forEach((id, i)=>{
        const el = document.getElementById(id);
        if (!el) return;
        const val = B.badges[i];
        if (isPlaceholder(val)) {
          el.style.display = "none";
        } else {
          el.textContent = String(val);
          el.style.display = "";
        }
      });
    }

    // Tier badge chips
    if (!isPlaceholder(B.badgePro)) setText("badgePro", B.badgePro);
    if (!isPlaceholder(B.badgeElite)) setText("badgeElite", B.badgeElite);

    // Brochure image + modal image
    setImage("brochureImg", B.brochureImage);
    setImage("modalImg", B.brochureImage);

    // Price
    setText("priceLabel", B.priceLabel);
    setText("priceValue", B.priceValue);
    setText("pricePill", B.pricePill);

    // Features
    if (Array.isArray(B.features)) {
      setText("feat1", B.features[0]);
      setText("feat2", B.features[1]);
      setText("feat3", B.features[2]);
      setText("feat4", B.features[3]);
    }
    setText("featPro", B.featurePro);
    setText("featElite", B.featureElite);

    // Footer / watermark
    setText("footerPill", B.footerPill);
    setText("watermarkText", B.watermark);

    // Contact links
    const phoneTel = sanitizePhoneTel(B.phoneTel);
    setLink("callBtn", phoneTel ? `tel:${phoneTel}` : "", "Call");
    setLink("textBtn", phoneTel ? buildSmsHref(phoneTel, B.textPrefill) : "", "Text");
    setLink("websiteBtn", !isPlaceholder(B.website) ? ensureHttp(B.website) : "", "Website");

    // View brochure button opens modal
    const viewBtn = document.getElementById("viewBrochureBtn");
    if (viewBtn) viewBtn.addEventListener("click", function(e){ e.preventDefault(); openModal(); });

    // Booking (optional)
    const bookingOk = !isPlaceholder(B.bookingLink);
    const bookingWrap = document.getElementById("bookingBtnWrap");
    if (bookingWrap) bookingWrap.style.display = bookingOk ? "" : "none";
    setLink("bookBtn", bookingOk ? ensureHttp(B.bookingLink) : "", "Book");

    // Elite CTA (optional + elite only)
    const eliteOk = (tier === "elite") && !isPlaceholder(B.eliteCtaUrl);
    const eliteWrap = document.getElementById("eliteCtaBtnWrap");
    if (eliteWrap) eliteWrap.style.display = eliteOk ? "" : "none";
    setLink("eliteCtaBtn", eliteOk ? ensureHttp(B.eliteCtaUrl) : "", B.eliteCtaLabel || "Elite Offer");

    // Tier section visibility
    showTierSections(tier);

    // Modal behavior
    const modal = document.getElementById("modal");
    const open1 = document.getElementById("openModal");
    const img = document.getElementById("modalImg");

    function openModal(){
      if (!modal) return;
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeModal(){
      if (!modal) return;
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }

    if (open1) open1.addEventListener("click", function(e){ e.preventDefault(); openModal(); });
    if (modal) modal.addEventListener("click", closeModal);
    if (img) img.addEventListener("click", closeModal);

    // Shine effect once
    const priceEl = document.getElementById("priceValue");
    window.addEventListener("load", () => {
      if (!priceEl) return;
      priceEl.classList.add("shine-once");
      setTimeout(()=>priceEl.classList.remove("shine-once"),1200);
    });

    // Ripple effect
    function addRipple(e){
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const cx = (e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || (rect.left + rect.width/2));
      const cy = (e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || (rect.top + rect.height/2));
      const x = cx - rect.left - size/2;
      const y = cy - rect.top - size/2;

      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", ()=>ripple.remove(), {once:true});
    }

    document.querySelectorAll(".btn").forEach(btn=>{
      btn.addEventListener("click", addRipple);
      btn.addEventListener("touchstart", addRipple, {passive:true});
    });
  });
})();
