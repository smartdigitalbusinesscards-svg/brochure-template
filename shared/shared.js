// shared/shared.js
(() => {
  const $ = (id) => document.getElementById(id);

  // ---------- helpers ----------
  const isPlaceholder = (v) =>
    !v || String(v).trim() === "" || /^REPLACE_/i.test(String(v).trim());

  const safeStr = (v, fallback = "") =>
    typeof v === "string" && v.trim() ? v.trim() : fallback;

  const normUrl = (u) => {
    if (isPlaceholder(u)) return "";
    const s = String(u).trim();
    if (!s) return "";
    if (/^https?:\/\//i.test(s)) return s;
    return "https://" + s.replace(/^\/+/, "");
  };

  const disableBtn = (a) => {
    if (!a) return;
    a.setAttribute("aria-disabled", "true");
    a.style.opacity = "0.45";
    a.style.pointerEvents = "none";
    a.removeAttribute("href");
    a.removeAttribute("target");
    a.removeAttribute("rel");
  };

  const enableHref = (a, href) => {
    if (!a) return;
    if (!href) return disableBtn(a);

    a.setAttribute("aria-disabled", "false");
    a.style.opacity = "";
    a.style.pointerEvents = "";
    a.setAttribute("href", href);

    if (/^https?:\/\//i.test(href)) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    } else {
      a.removeAttribute("target");
      a.removeAttribute("rel");
    }
  };

  const buildTel = (rawDigits) => {
    const digits = String(rawDigits || "").replace(/\D/g, "");
    if (!digits) return { tel: "", sms: "" };
    const phone = digits.length === 10 ? ("1" + digits) : digits; // allow 10-digit US -> +1
    return {
      tel: `tel:+${phone}`,
      sms: `sms:+${phone}`,
    };
  };

  // ---------- tier ----------
  const normalizeTier = (t) => {
    t = (t || "").toString().trim().toLowerCase();
    return (t === "starter" || t === "pro" || t === "elite") ? t : null;
  };

  const getTier = () => {
    // Prefer URL override for testing: ?tier=elite
    const qsTier = normalizeTier(new URLSearchParams(window.location.search).get("tier"));

    // Fallback to hash: #tier=elite or #?tier=elite
    const rawHash = (window.location.hash || "").replace(/^#/, "");
    const hashQuery = rawHash.startsWith("?") ? rawHash.slice(1) : rawHash;
    const hashTier = normalizeTier(new URLSearchParams(hashQuery).get("tier"));

    // Brochure default tier = pro (not starter)
    const tier = qsTier || hashTier || normalizeTier(window.BIZ?.tier) || "pro";
    return tier;
  };

  // ---------- features by tier ----------
  const FEATURES = {
    starter: { basicCtas: false, primaryCta: false, eliteExtras: false },
    pro:     { basicCtas: true,  primaryCta: true,  eliteExtras: false },
    elite:   { basicCtas: true,  primaryCta: true,  eliteExtras: true  },
  };

  // ---------- theme tokens ----------
  const THEMES = {
    aqua: {
      bgA: "#04151f",
      bgB: "#0a2f3f",
      accent: "#4fe3ff",
      accent2: "#63ffb2",
    },
    mint: {
      bgA: "#061a16",
      bgB: "#0b2a24",
      accent: "#63ffb2",
      accent2: "#4fe3ff",
    },
    midnight: {
      bgA: "#050916",
      bgB: "#0a1535",
      accent: "#4aa8ff",
      accent2: "#7c5cff",
    },
    graphite: {
      bgA: "#070A12",
      bgB: "#0B1222",
      accent: "#4aa8ff",
      accent2: "#34f7ff",
    },
    ember: {
      bgA: "#120606",
      bgB: "#2a0b0b",
      accent: "#ff5a3d",
      accent2: "#ffb84a",
    },
    royal: {
      bgA: "#07051a",
      bgB: "#130a33",
      accent: "#7c5cff",
      accent2: "#4aa8ff",
    },
    elegantPink: {
      bgA: "#16070f",
      bgB: "#2a0c1c",
      accent: "#ff5fa2",
      accent2: "#ffd1e6",
    },
  };

  const applyThemeVars = (tObj) => {
    if (!tObj) return;
    const root = document.documentElement.style;
    if (tObj.accent)  root.setProperty("--accent",  tObj.accent);
    if (tObj.accent2) root.setProperty("--accent2", tObj.accent2);
    if (tObj.bgA)     root.setProperty("--bgA",     tObj.bgA);
    if (tObj.bgB)     root.setProperty("--bgB",     tObj.bgB);
  };

  // ---------- apply ----------
  const apply = () => {
    const B = (window.BIZ && typeof window.BIZ === "object") ? window.BIZ : {};
    const tier = getTier();
    const f = FEATURES[tier];

    // ---- Theme token (default aqua; starter forced aqua)
    let themeToken = (typeof B.theme === "string") ? B.theme.trim().toLowerCase() : "";
    if (!themeToken) themeToken = "aqua";
    if (tier === "starter") themeToken = "aqua";

    if (THEMES[themeToken]) {
      applyThemeVars(THEMES[themeToken]);
    } else if (B.theme && typeof B.theme === "object") {
      // legacy object override supported
      applyThemeVars(B.theme);
    } else {
      applyThemeVars(THEMES.aqua);
    }

    // ---- Brand / headers
    const company = safeStr(B.company, "Company");
    const offerTitle = safeStr(B.offerTitle || B.title, "Offer Title");
    const watermark = safeStr(B.watermark, `Installed by ${company}`);

    const kicker = $("kicker");
    const titleH1 = $("titleH1");
    if (kicker) kicker.textContent = company;
    if (titleH1) titleH1.textContent = offerTitle;
    document.title = `${company} | ${offerTitle}`;

    const wm = $("watermark");
    if (wm) wm.textContent = watermark;

    // ---- Pricing
    const priceLabel = safeStr(B.priceLabel, "Total Price");
    const priceValue = safeStr(B.priceValue, "$0");
    const priceNote  = safeStr(B.priceNote, "One-time total");

    const pl = $("priceLabel");
    const pv = $("priceValue");
    const pn = $("priceNote");
    if (pl) pl.textContent = priceLabel;
    if (pv) pv.textContent = priceValue;
    if (pn) pn.textContent = priceNote;

    // ---- Footer year
    const yearEl = $("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // ---- Product image
    const productImage = safeStr(B.productImage || B.brochureImage || "product.png");

    const img = $("productImg");
    const imgNoJs = $("productImgNoJs");
    const modalImg = $("modalImg");
    const hintText = $("imgHintText");

    if (img) { img.src = productImage; img.alt = `${company} product image`; }
    if (imgNoJs) { imgNoJs.src = productImage; imgNoJs.alt = `${company} product image`; }
    if (modalImg) { modalImg.src = productImage; modalImg.alt = `${company} product image enlarged`; }
    if (hintText) hintText.textContent = "Tap the product image to zoom in.";

    // ---- Badges
    const badges = Array.isArray(B.badges) ? B.badges : [];
    const badgeRow = $("badgeRow");
    if (badgeRow) {
      badgeRow.innerHTML = "";
      badges.forEach((b) => {
        const txt = safeStr(b, "");
        if (!txt) return;
        const div = document.createElement("div");
        div.className = "badge";
        div.textContent = txt;
        badgeRow.appendChild(div);
      });
    }

    // ---- Features
    const features = Array.isArray(B.features) ? B.features : [];
    const list = $("featureList");
    if (list) {
      list.innerHTML = "";
      features.forEach((feat) => {
        const txt = safeStr(feat, "");
        if (!txt) return;
        const li = document.createElement("li");
        li.innerHTML = `<span class="check" aria-hidden="true">✓</span><span class="liText"></span>`;
        li.querySelector(".liText").textContent = txt;
        list.appendChild(li);
      });
    }

    // ---- Contact links
    const { tel, sms } = buildTel(B.phoneTel || B.phone || "");
    const email = safeStr(B.email, "");
    const website = normUrl(B.website);

    const ctaRow = $("ctaRow");
    if (ctaRow) ctaRow.style.display = (f.basicCtas || f.primaryCta) ? "" : "none";

    // Primary CTA (Pro + Elite)
    const primaryBtn = $("primaryBtn");
    const primaryLabel = safeStr(B.primaryCtaLabel, "Request Info");
    const primaryUrl = normUrl(B.primaryCtaUrl);

    if (primaryBtn) {
      primaryBtn.textContent = primaryLabel;
      if (!f.primaryCta) {
        primaryBtn.style.display = "none";
        disableBtn(primaryBtn);
      } else {
        primaryBtn.style.display = "";
        enableHref(primaryBtn, primaryUrl);
      }
    }

    // Basic buttons (Pro + Elite)
    enableHref($("textBtn"),  f.basicCtas ? sms : "");
    enableHref($("callBtn"),  f.basicCtas ? tel : "");
    enableHref($("emailBtn"), f.basicCtas ? (email ? `mailto:${email}` : "") : "");
    enableHref($("webBtn"),   f.basicCtas ? website : "");

    // No-JS website fallback
    const webBtnNoJs = $("webBtnNoJs");
    if (webBtnNoJs) enableHref(webBtnNoJs, website);

    // ---- Elite extras block
    const eliteBlock = $("eliteBlock");
    if (eliteBlock) eliteBlock.style.display = f.eliteExtras ? "" : "none";

    // Elite secondary CTA
    const requestInfoBtn = $("requestInfoBtn");
    const secondaryLabel = safeStr(B.secondaryCtaLabel, "Request More Info");
    const secondaryUrl = normUrl(B.secondaryCtaUrl);

    if (requestInfoBtn) {
      requestInfoBtn.textContent = secondaryLabel;
      if (!f.eliteExtras) {
        disableBtn(requestInfoBtn);
      } else {
        enableHref(requestInfoBtn, secondaryUrl);
      }
    }

    // Elite social proof
    const socialProofWrap = $("socialProof");
    const socialProof = Array.isArray(B.socialProof) ? B.socialProof : [];
    if (socialProofWrap) {
      socialProofWrap.innerHTML = "";
      if (f.eliteExtras && socialProof.length) {
        socialProof.forEach((item) => {
          const text = (typeof item === "string") ? safeStr(item, "") : safeStr(item?.text, "");
          const name = (typeof item === "object") ? safeStr(item?.name, "") : "";
          if (!text) return;

          const card = document.createElement("div");
          card.className = "proofCard";
          card.innerHTML = `<div class="proofText">“${text}”</div>${
            name ? `<div class="proofName">— ${name}</div>` : ""
          }`;

          socialProofWrap.appendChild(card);
        });
      }
    }

    // Elite embedded content
    const advancedEmbed = $("advancedEmbed");
    const embedHtml = safeStr(B.embedHtml, "");
    const embedUrl = safeStr(B.embedUrl, "");

    if (advancedEmbed) {
      if (f.eliteExtras && (embedHtml || embedUrl)) {
        advancedEmbed.style.display = "block";
        advancedEmbed.style.marginTop = "10px";

        if (embedHtml) {
          advancedEmbed.innerHTML = embedHtml;
        } else {
          advancedEmbed.innerHTML = `
            <div class="embedShell">
              <div class="embedRatio">
                <iframe
                  src="${embedUrl}"
                  title="Embedded content"
                  loading="lazy"
                  referrerpolicy="no-referrer"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          `;
        }
      } else {
        advancedEmbed.style.display = "none";
        advancedEmbed.innerHTML = "";
      }
    }
  };

  // ---------- modal ----------
  const wireModal = () => {
    const modal = $("modal");
    const openModalBtn = $("openModal");
    const modalClose = $("modalClose");

    const open = () => {
      if (!modal) return;
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    };

    const close = () => {
      if (!modal) return;
      modal.classList.remove("open");
      document.body.style.overflow = "";
    };

    openModalBtn?.addEventListener("click", open);

    modal?.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });

    modalClose?.addEventListener("click", close);

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal?.classList.contains("open")) close();
    });
  };

  // ---------- price shine ----------
  const wirePriceShine = () => {
    const priceEl = $("priceValue");
    window.addEventListener("load", () => {
      if (!priceEl) return;
      priceEl.classList.add("shine-once");
      setTimeout(() => priceEl.classList.remove("shine-once"), 1200);
    });
  };

  // ---------- ripple ----------
  const wireRipple = () => {
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
  };

  // ---------- init ----------
  const init = () => {
    apply();
    wireModal();
    wirePriceShine();
    wireRipple();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("hashchange", apply);
})();
