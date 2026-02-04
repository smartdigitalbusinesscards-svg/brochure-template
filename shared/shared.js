(function () {
  const cfg = (window.BROCHURE_CONFIG || {});
  const safeStr = (v, fallback="") => (typeof v === "string" && v.trim()) ? v.trim() : fallback;

  // ---- tier normalize
  const tier = safeStr(cfg.tier, "starter").toLowerCase();
  const TIER = (tier === "pro" || tier === "elite") ? tier : "starter";

  // ---- brand
  const company  = safeStr(cfg.brand?.company, "Select Source Water");
  const product  = safeStr(cfg.brand?.product, "Hygia Whole-Home Filtration + Softener");
  const watermark = safeStr(cfg.brand?.watermark, `Installed by ${company}`);

  // ---- pricing
  const priceLabel = safeStr(cfg.pricing?.label, "Total Price");
  const priceValue = safeStr(cfg.pricing?.value, "$0");
  const priceNote  = safeStr(cfg.pricing?.note, "One-time total");

  // ---- images + CTA label
  const brochureImage = safeStr(cfg.brochureImage, "brochure.png");
  const ctaLabel = safeStr(cfg.cta?.label, "View Brochure");

  // ---- contact
  const rawPhone = safeStr(cfg.contact?.phone, "");
  const website  = safeStr(cfg.contact?.website, "");

  // phone sanitizer: keep digits only, assume US if 10 digits
  const digits = rawPhone.replace(/\D/g, "");
  const phoneForLinks = digits.length === 10 ? ("1" + digits) : digits; // e.g. 1209...
  const telHref = phoneForLinks ? ("tel:+" + phoneForLinks) : null;
  const smsHref = phoneForLinks ? ("sms:+" + phoneForLinks) : null;

  // ---- badges + features
  const badges = Array.isArray(cfg.badges) ? cfg.badges : [];
  const features = Array.isArray(cfg.features) ? cfg.features : [];

  // ---- helpers
  const el = (id) => document.getElementById(id);

  // ---- text injections
  el("kicker").textContent = company;
  el("titleH1").textContent = product;

  document.title = `${company} | ${product}`;

  el("priceLabel").textContent = priceLabel;
  el("priceValue").textContent = priceValue;
  el("priceNote").textContent  = priceNote;

  el("footerRight").innerHTML = `© <span id="year"></span> ${company}`;
  el("year").textContent = String(new Date().getFullYear());

  el("watermark").textContent = watermark;

  // brochure images
  el("brochureImg").src = brochureImage;
  el("brochureImg").alt = `${company} brochure`;
  const noJsImg = el("brochureImgNoJs");
  if (noJsImg) {
    noJsImg.src = brochureImage;
    noJsImg.alt = `${company} brochure`;
  }
  el("modalImg").src = brochureImage;
  el("modalImg").alt = `${company} brochure enlarged`;

  // badges
  const badgeRow = el("badgeRow");
  badgeRow.innerHTML = "";
  badges.forEach(b => {
    const txt = safeStr(b, "");
    if (!txt) return;
    const div = document.createElement("div");
    div.className = "badge";
    div.textContent = txt;
    badgeRow.appendChild(div);
  });

  // features list
  const list = el("featureList");
  list.innerHTML = "";
  features.forEach(f => {
    const txt = safeStr(f, "");
    if (!txt) return;
    const li = document.createElement("li");
    li.innerHTML = `<span class="check" aria-hidden="true">✓</span><span class="liText"></span>`;
    li.querySelector(".liText").textContent = txt;
    list.appendChild(li);
  });

  // ✅ CTA rules (your “assurance”):
  // - Starter: NO “View Brochure” CTA button
  // - Pro: YES (View Brochure + Text/Call/Website)
  // - Elite: YES (View Brochure + Text/Call/Website)
  const ctaEnabledByTier = (TIER === "pro" || TIER === "elite");
  const ctaFlag = (cfg.cta && typeof cfg.cta.enabled === "boolean") ? cfg.cta.enabled : ctaEnabledByTier;
  const showCTA = Boolean(ctaFlag) && ctaEnabledByTier;

  const viewBtn = el("viewBtn");
  viewBtn.textContent = ctaLabel;
  if (!showCTA) viewBtn.style.display = "none";

  // Contact buttons (always exist; disabled if missing)
  const textBtn = el("textBtn");
  const callBtn = el("callBtn");
  const webBtn  = el("webBtn");

  function disableBtn(a){
    a.setAttribute("aria-disabled","true");
    a.style.opacity = "0.45";
    a.style.pointerEvents = "none";
    a.removeAttribute("href");
  }

  if (smsHref) textBtn.href = smsHref; else disableBtn(textBtn);
  if (telHref) callBtn.href = telHref; else disableBtn(callBtn);
  if (website) webBtn.href = website; else disableBtn(webBtn);

  // ---- Modal open/close
  const modal = el("modal");
  const openModalBtn = el("openModal");
  const modalClose = el("modalClose");

  function openModal(){
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeModal(){
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  openModalBtn.addEventListener("click", openModal);
  viewBtn.addEventListener("click", (e) => { e.preventDefault(); openModal(); });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  modalClose.addEventListener("click", closeModal);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  // ---- Price shine once
  const priceEl = el("priceValue");
  window.addEventListener("load", () => {
    priceEl.classList.add("shine-once");
    setTimeout(() => priceEl.classList.remove("shine-once"), 1200);
  });

  // ---- Ripple effect (buttons only)
  function addRipple(e){
    const btn = e.currentTarget;
    if (!btn || btn.getAttribute("aria-disabled") === "true") return;

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;

    const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
    const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left - size/2;
    const y = clientY - rect.top - size/2;

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

  // ---- Optional: apply accent colors per config
  if (cfg.theme) {
    const root = document.documentElement.style;
    if (cfg.theme.accent)  root.setProperty("--accent",  cfg.theme.accent);
    if (cfg.theme.accent2) root.setProperty("--accent2", cfg.theme.accent2);
    if (cfg.theme.bgA)     root.setProperty("--bgA",     cfg.theme.bgA);
    if (cfg.theme.bgB)     root.setProperty("--bgB",     cfg.theme.bgB);
  }
})();
