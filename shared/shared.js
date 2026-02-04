(function () {
  const cfg = (window.BROCHURE_CONFIG || {});
  const safeStr = (v, fallback = "") => (typeof v === "string" && v.trim()) ? v.trim() : fallback;

  // ---- tier normalize
  const tierRaw = safeStr(cfg.tier, "starter").toLowerCase();
  const TIER = (tierRaw === "pro" || tierRaw === "elite") ? tierRaw : "starter";

  // ---- helpers
  const el = (id) => document.getElementById(id);
  const isHttps = (url) => /^https:\/\//i.test(url || "");
  const digitsOnly = (s) => (s || "").replace(/\D/g, "");

  function disableBtn(a) {
    if (!a) return;
    a.setAttribute("aria-disabled", "true");
    a.style.opacity = "0.45";
    a.style.pointerEvents = "none";
    a.removeAttribute("href");
  }

  function showBtn(a) {
    if (!a) return;
    a.style.display = "";
    a.removeAttribute("aria-disabled");
    a.style.opacity = "";
    a.style.pointerEvents = "";
  }

  // ---- brand
  const company   = safeStr(cfg.brand?.company, "Company");
  const product   = safeStr(cfg.brand?.product, "Offer Title");
  const watermark = safeStr(cfg.brand?.watermark, `Installed by ${company}`);

  el("kicker").textContent = company;
  el("titleH1").textContent = product;
  el("watermark").textContent = watermark;

  document.title = `${company} | ${product}`;

  // ---- pricing
  el("priceLabel").textContent = safeStr(cfg.pricing?.label, "Total Price");
  el("priceValue").textContent = safeStr(cfg.pricing?.value, "$0");
  el("priceNote").textContent  = safeStr(cfg.pricing?.note, "One-time total");

  // footer
  el("footerRight").innerHTML = `© <span id="year"></span> ${company}`;
  el("year").textContent = String(new Date().getFullYear());

  // ---- badges
  const badgeRow = el("badgeRow");
  badgeRow.innerHTML = "";
  (Array.isArray(cfg.badges) ? cfg.badges : []).forEach(b => {
    const txt = safeStr(b, "");
    if (!txt) return;
    const div = document.createElement("div");
    div.className = "badge";
    div.textContent = txt;
    badgeRow.appendChild(div);
  });

  // ---- features list
  const list = el("featureList");
  list.innerHTML = "";
  (Array.isArray(cfg.features) ? cfg.features : []).forEach(f => {
    const txt = safeStr(f, "");
    if (!txt) return;
    const li = document.createElement("li");
    li.innerHTML = `<span class="check" aria-hidden="true">✓</span><span class="liText"></span>`;
    li.querySelector(".liText").textContent = txt;
    list.appendChild(li);
  });

  // ---- theme overrides (optional)
  if (cfg.theme) {
    const root = document.documentElement.style;
    if (cfg.theme.accent)  root.setProperty("--accent",  cfg.theme.accent);
    if (cfg.theme.accent2) root.setProperty("--accent2", cfg.theme.accent2);
    if (cfg.theme.bgA)     root.setProperty("--bgA",     cfg.theme.bgA);
    if (cfg.theme.bgB)     root.setProperty("--bgB",     cfg.theme.bgB);
  }

  // ---- product image
  const productImage = safeStr(cfg.productImage, "product.png");
  const productImg = el("productImg");
  const productImgNoJs = el("productImgNoJs");
  const modalImg = el("modalImg");

  if (productImg) {
    productImg.src = productImage;
    productImg.alt = `${company} product image`;
  }
  if (productImgNoJs) {
    productImgNoJs.src = productImage;
    productImgNoJs.alt = `${company} product image`;
  }
  if (modalImg) {
    modalImg.src = productImage;
    modalImg.alt = `${company} product enlarged view`;
  }

  // ---- modal open/close
  const modal = el("modal");
  const openModalBtn = el("openModal");
  const modalClose = el("modalClose");

  function openModal() {
    if (!modal) return;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (openModalBtn) openModalBtn.addEventListener("click", openModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }
  if (modalClose) modalClose.addEventListener("click", closeModal);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) closeModal();
  });

  // ---- contact links
  const rawPhone = safeStr(cfg.contact?.phone, "");
  const phoneDigits = digitsOnly(rawPhone);
  const phoneForLinks = phoneDigits.length === 10 ? ("1" + phoneDigits) : phoneDigits; // assumes US if 10 digits
  const telHref = phoneForLinks ? ("tel:+" + phoneForLinks) : null;
  const smsHref = phoneForLinks ? ("sms:+" + phoneForLinks) : null;

  const email = safeStr(cfg.contact?.email, "");
  const emailHref = email ? (`mailto:${encodeURIComponent(email)}`) : null;

  const website = safeStr(cfg.contact?.website, "");
  const webHref = (website && isHttps(website)) ? website : null;

  // ---- buttons
  const ctaRow = el("ctaRow");
  const primaryBtn = el("primaryBtn");
  const textBtn = el("textBtn");
  const callBtn = el("callBtn");
  const emailBtn = el("emailBtn");
  const webBtn = el("webBtn");
  const webBtnNoJs = el("webBtnNoJs");

  // no-js website fallback
  if (webBtnNoJs) {
    if (webHref) webBtnNoJs.href = webHref;
    else disableBtn(webBtnNoJs);
  }

  // Tier rules:
  // Starter: NO buttons
  // Pro: Text/Call/Email/Website
  // Elite: Pro buttons + Primary CTA + elite sections
  const isStarter = TIER === "starter";
  const isPro = TIER === "pro";
  const isElite = TIER === "elite";

  if (ctaRow) {
    if (isStarter) {
      ctaRow.style.display = "none";
    } else {
      ctaRow.style.display = "";
    }
  }

  // Primary CTA (Elite only)
  const primaryCfg = cfg.primaryCta || {};
  const primaryEnabledFlag = (typeof primaryCfg.enabled === "boolean") ? primaryCfg.enabled : true;
  const primaryLabel = safeStr(primaryCfg.label, "Request Info");
  const primaryUrl = safeStr(primaryCfg.url, "");

  if (primaryBtn) {
    primaryBtn.textContent = primaryLabel;

    if (!isElite || !primaryEnabledFlag || !isHttps(primaryUrl)) {
      primaryBtn.style.display = "none";
      disableBtn(primaryBtn);
    } else {
      primaryBtn.style.display = "";
      showBtn(primaryBtn);
      primaryBtn.href = primaryUrl;
      primaryBtn.target = "_blank";
      primaryBtn.rel = "noopener";
    }
  }

  // Pro/Elite basics
  function setOrDisable(a, href) {
    if (!a) return;
    if (isStarter) {
      a.style.display = "none";
      return;
    }
    // pro + elite: show
    a.style.display = "";
    if (href) {
      showBtn(a);
      a.href = href;
    } else {
      disableBtn(a);
    }
  }

  setOrDisable(textBtn, smsHref);
  setOrDisable(callBtn, telHref);
  setOrDisable(emailBtn, emailHref);
  setOrDisable(webBtn, webHref);

  // ---- Elite-only: social proof
  const socialProofWrap = el("socialProofWrap");
  const testimonialList = el("testimonialList");

  if (socialProofWrap && testimonialList) {
    if (!isElite) {
      socialProofWrap.style.display = "none";
    } else {
      const testimonials = Array.isArray(cfg.testimonials) ? cfg.testimonials : [];
      testimonialList.innerHTML = "";

      if (testimonials.length === 0) {
        socialProofWrap.style.display = "none";
      } else {
        socialProofWrap.style.display = "";
        testimonials.forEach(t => {
          const txt = safeStr(t, "");
          if (!txt) return;
          const li = document.createElement("li");
          li.innerHTML = `<span class="check" aria-hidden="true">★</span><span class="liText"></span>`;
          li.querySelector(".liText").textContent = txt;
          testimonialList.appendChild(li);
        });
      }
    }
  }

  // ---- Elite-only: embedded content
  const embedWrap = el("embedWrap");
  const embedList = el("embedList");

  if (embedWrap && embedList) {
    if (!isElite) {
      embedWrap.style.display = "none";
    } else {
      const embeds = Array.isArray(cfg.embeds) ? cfg.embeds : [];
      embedList.innerHTML = "";

      // Only allow HTTPS iframes to avoid broken/unsafe embeds
      const safeEmbeds = embeds
        .map(e => ({
          title: safeStr(e?.title, ""),
          src: safeStr(e?.src, ""),
          height: Number(e?.height || 360)
        }))
        .filter(e => e.src && isHttps(e.src));

      if (safeEmbeds.length === 0) {
        embedWrap.style.display = "none";
      } else {
        embedWrap.style.display = "";
        safeEmbeds.forEach(e => {
          const wrap = document.createElement("div");
          wrap.style.marginTop = "12px";
          wrap.style.border = "1px solid rgba(255,255,255,.10)";
          wrap.style.borderRadius = "14px";
          wrap.style.overflow = "hidden";
          wrap.style.background = "rgba(0,0,0,.12)";

          if (e.title) {
            const title = document.createElement("div");
            title.style.padding = "10px 12px";
            title.style.fontWeight = "850";
            title.style.color = "rgba(236,246,255,.85)";
            title.style.fontSize = "13px";
            title.textContent = e.title;
            wrap.appendChild(title);
          }

          const iframe = document.createElement("iframe");
          iframe.src = e.src;
          iframe.title = e.title || "Embedded content";
          iframe.loading = "lazy";
          iframe.referrerPolicy = "no-referrer";
          iframe.allowFullscreen = true;
          iframe.style.width = "100%";
          iframe.style.height = `${Math.max(220, Math.min(900, e.height))}px`;
          iframe.style.border = "0";
          wrap.appendChild(iframe);

          embedList.appendChild(wrap);
        });
      }
    }
  }

  // ---- Price shine once
  const priceEl = el("priceValue");
  window.addEventListener("load", () => {
    if (!priceEl) return;
    priceEl.classList.add("shine-once");
    setTimeout(() => priceEl.classList.remove("shine-once"), 1200);
  });

  // ---- Ripple effect (buttons only)
  function addRipple(e) {
    const btn = e.currentTarget;
    if (!btn || btn.getAttribute("aria-disabled") === "true") return;

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;

    const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
    const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    btn.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  }

  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", addRipple);
    btn.addEventListener("touchstart", addRipple, { passive: true });
  });
})();
