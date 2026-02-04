// shared/shared.js
(function () {
  const cfg = window.BROCHURE_CONFIG || {};

  const safeStr = (v, fallback = "") =>
    typeof v === "string" && v.trim() ? v.trim() : fallback;

  const getParam = (key) => {
    try {
      const url = new URL(window.location.href);
      return url.searchParams.get(key);
    } catch {
      return null;
    }
  };

  // Tier: allow ?tier=starter|pro|elite override for testing
  const tierFromCfg = safeStr(cfg.tier, "starter").toLowerCase();
  const tierFromUrl = safeStr(getParam("tier"), "").toLowerCase();
  const tierRaw = (tierFromUrl || tierFromCfg);
  const TIER = (tierRaw === "pro" || tierRaw === "elite") ? tierRaw : "starter";

  const el = (id) => document.getElementById(id);

  // ---- Brand
  const company = safeStr(cfg.brand?.company, "Company");
  const product = safeStr(cfg.brand?.product, "Offer Title");
  const watermark = safeStr(cfg.brand?.watermark, `Installed by ${company}`);

  // ---- Pricing
  const priceLabel = safeStr(cfg.pricing?.label, "Total Price");
  const priceValue = safeStr(cfg.pricing?.value, "$0");
  const priceNote  = safeStr(cfg.pricing?.note, "One-time total");

  // ---- Images (you renamed to product.png)
  const productImage = safeStr(cfg.productImage, safeStr(cfg.brochureImage, "product.png"));

  // ---- Contact + Elite Extras
  const rawPhone = safeStr(cfg.contact?.phone, "");
  const email    = safeStr(cfg.contact?.email, "");
  const website  = safeStr(cfg.contact?.website, "");

  // Elite-only CTA URL (intake form / request info)
  const requestInfoUrl =
    safeStr(cfg.elite?.requestInfoUrl, safeStr(cfg.contact?.requestInfoUrl, ""));

  // Elite-only social proof
  const socialProof = Array.isArray(cfg.elite?.socialProof) ? cfg.elite.socialProof : [];

  // Elite-only embedded content
  // Option A: embedHtml (full HTML string)
  // Option B: embedUrl (iframe URL)
  const embedHtml = safeStr(cfg.elite?.embedHtml, "");
  const embedUrl  = safeStr(cfg.elite?.embedUrl, "");

  // ---- Badges + Features
  const badges = Array.isArray(cfg.badges) ? cfg.badges : [];
  const features = Array.isArray(cfg.features) ? cfg.features : [];

  // ---- Apply theme vars (optional)
  if (cfg.theme) {
    const root = document.documentElement.style;
    if (cfg.theme.accent)  root.setProperty("--accent",  cfg.theme.accent);
    if (cfg.theme.accent2) root.setProperty("--accent2", cfg.theme.accent2);
    if (cfg.theme.bgA)     root.setProperty("--bgA",     cfg.theme.bgA);
    if (cfg.theme.bgB)     root.setProperty("--bgB",     cfg.theme.bgB);
  }

  // ---- Inject text
  el("kicker").textContent = company;
  el("titleH1").textContent = product;
  document.title = `${company} | ${product}`;

  el("priceLabel").textContent = priceLabel;
  el("priceValue").textContent = priceValue;
  el("priceNote").textContent  = priceNote;

  el("watermark").textContent = watermark;

  // Footer year
  const yearEl = el("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---- Product image
  const img = el("brochureImg");
  const imgNoJs = el("brochureImgNoJs");
  const modalImg = el("modalImg");
  const hintText = el("imgHintText");

  if (img) {
    img.src = productImage;
    img.alt = `${company} product image`;
  }
  if (imgNoJs) {
    imgNoJs.src = productImage;
    imgNoJs.alt = `${company} product image`;
  }
  if (modalImg) {
    modalImg.src = productImage;
    modalImg.alt = `${company} product image enlarged`;
  }
  if (hintText) hintText.textContent = "Tap the product image to zoom in.";

  // ---- Badges
  const badgeRow = el("badgeRow");
  badgeRow.innerHTML = "";
  badges.forEach((b) => {
    const txt = safeStr(b, "");
    if (!txt) return;
    const div = document.createElement("div");
    div.className = "badge";
    div.textContent = txt;
    badgeRow.appendChild(div);
  });

  // ---- Features
  const list = el("featureList");
  list.innerHTML = "";
  features.forEach((f) => {
    const txt = safeStr(f, "");
    if (!txt) return;
    const li = document.createElement("li");
    li.innerHTML = `<span class="check" aria-hidden="true">✓</span><span class="liText"></span>`;
    li.querySelector(".liText").textContent = txt;
    list.appendChild(li);
  });

  // ---- Helpers for buttons
  function disableBtn(a) {
    if (!a) return;
    a.setAttribute("aria-disabled", "true");
    a.style.opacity = "0.45";
    a.style.pointerEvents = "none";
    a.removeAttribute("href");
  }

  // phone sanitizer
  const digits = rawPhone.replace(/\D/g, "");
  const phoneForLinks = digits.length === 10 ? ("1" + digits) : digits; // 1209...
  const telHref = phoneForLinks ? ("tel:+" + phoneForLinks) : null;
  const smsHref = phoneForLinks ? ("sms:+" + phoneForLinks) : null;
  const mailHref = email ? ("mailto:" + email) : null;

  const textBtn = el("textBtn");
  const callBtn = el("callBtn");
  const emailBtn = el("emailBtn");
  const webBtn = el("webBtn");

  // ---- Tier rules for “basic CTAs”
  // Starter: no action buttons
  // Pro: Text/Call/Email/Website
  // Elite: Text/Call/Email/Website + Elite extras
  const showBasicCTAs = (TIER === "pro" || TIER === "elite");

  if (!showBasicCTAs) {
    // hide the whole CTA row for starter
    const ctaRow = el("ctaRow");
    if (ctaRow) ctaRow.style.display = "none";
  } else {
    // set links (or disable)
    if (textBtn) (smsHref ? (textBtn.href = smsHref) : disableBtn(textBtn));
    if (callBtn) (telHref ? (callBtn.href = telHref) : disableBtn(callBtn));
    if (emailBtn) (mailHref ? (emailBtn.href = mailHref) : disableBtn(emailBtn));
    if (webBtn) (website ? (webBtn.href = website) : disableBtn(webBtn));
  }

  // ---- Elite extras block
  const eliteBlock = el("eliteBlock");
  if (eliteBlock) {
    eliteBlock.style.display = (TIER === "elite") ? "" : "none";
  }

  // Elite “Request More Info” button
  const requestInfoBtn = el("requestInfoBtn");
  if (requestInfoBtn) {
    if (TIER === "elite" && requestInfoUrl) {
      requestInfoBtn.href = requestInfoUrl;
    } else {
      disableBtn(requestInfoBtn);
    }
  }

  // Elite Social Proof
  const socialWrap = el("socialProof");
  if (socialWrap) {
    socialWrap.innerHTML = "";
    if (TIER === "elite" && socialProof.length) {
      socialProof.forEach((item) => {
        const text = (typeof item === "string") ? item : safeStr(item?.text, "");
        const name = (typeof item === "object") ? safeStr(item?.name, "") : "";
        if (!text) return;

        const card = document.createElement("div");
        card.style.border = "1px solid rgba(255,255,255,.10)";
        card.style.background = "rgba(0,0,0,.12)";
        card.style.borderRadius = "14px";
        card.style.padding = "12px 14px";
        card.style.fontSize = "14px";

        card.innerHTML = `<div style="opacity:.92;">“${text}”</div>${
          name ? `<div style="margin-top:6px; opacity:.65; font-size:12px;">— ${name}</div>` : ""
        }`;

        socialWrap.appendChild(card);
      });
    }
  }

  // Elite Advanced Embed
  const embedWrap = el("advancedEmbed");
  if (embedWrap) {
    if (TIER === "elite" && (embedHtml || embedUrl)) {
      embedWrap.style.display = "block";
      embedWrap.style.marginTop = "10px";

      if (embedHtml) {
        // trust ONLY if you control the content
        embedWrap.innerHTML = embedHtml;
      } else if (embedUrl) {
        embedWrap.innerHTML = `
          <div style="border:1px solid rgba(255,255,255,.10); background:rgba(0,0,0,.12); border-radius:14px; overflow:hidden;">
            <div style="position:relative; width:100%; padding-top:56.25%;">
              <iframe
                src="${embedUrl}"
                title="Embedded content"
                style="position:absolute; inset:0; width:100%; height:100%; border:0;"
                loading="lazy"
                referrerpolicy="no-referrer"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        `;
      }
    } else {
      embedWrap.style.display = "none";
      embedWrap.innerHTML = "";
    }
  }

  // ---- Modal open/close
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

  // ---- Price shine once
  const priceEl = el("priceValue");
  window.addEventListener("load", () => {
    if (!priceEl) return;
    priceEl.classList.add("shine-once");
    setTimeout(() => priceEl.classList.remove("shine-once"), 1200);
  });

  // ---- Ripple effect (buttons)
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

  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", addRipple);
    btn.addEventListener("touchstart", addRipple, { passive: true });
  });
})();
