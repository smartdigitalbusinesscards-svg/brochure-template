// shared/shared.js
(() => {
  const $ = id => document.getElementById(id);

  const isPlaceholder = v => !v || String(v).trim() === "" || /REPLACE_/i.test(String(v).trim());

  const normUrl = u => {
    if (isPlaceholder(u)) return "";
    let s = String(u).trim();
    if (/^https?:\/\//i.test(s)) return s;
    return "https://" + s;
  };

  const normPhone = p => String(p || "").replace(/[^\d+]/g, "");

  const setText = (id, val, fallback = "") => {
    const el = $(id);
    if (el) el.textContent = isPlaceholder(val) ? fallback : String(val).trim();
  };

  const enableLink = (id, href, label = null) => {
    const a = $(id);
    if (!a) return;
    if (!href) {
      a.setAttribute("aria-disabled", "true");
      a.classList.add("disabled");
      return;
    }
    a.href = href;
    a.removeAttribute("aria-disabled");
    a.classList.remove("disabled");
    if (label) a.textContent = label;
  };

  const init = () => {
    const B = window.BIZ || {};
    const tier = (B.tier || "starter").toLowerCase().trim();

    document.documentElement.dataset.tier = tier;

    // Basics
    setText("pageTitle", `${B.company} | ${B.productTitle}`);
    setText("companyKicker", B.company, "Company Name");
    setText("productTitle", B.productTitle, "Product Name");
    setText("priceValue", B.price, "$ --");
    setText("companyFooter", B.company);
    setText("companyWatermark", B.company);
    setText("year", new Date().getFullYear());

    // Image
    const imgSrc = isPlaceholder(B.brochureImg) ? "brochure.png" : B.brochureImg;
    const brochureImg = $("brochureImg");
    const modalImg = $("modalImg");
    if (brochureImg) brochureImg.src = imgSrc;
    if (modalImg) modalImg.src = imgSrc;

    // Features list
    const ul = $("featuresList");
    if (ul && Array.isArray(B.features) && B.features.length) {
      ul.innerHTML = B.features.map(f => `<li><span class="check">✓</span><span class="liText">${f}</span></li>`).join("");
    }

    // Badges (pro/elite show more/custom)
    const badgeRow = $("badgeRow");
    if (badgeRow && Array.isArray(B.badges) && B.badges.length) {
      badgeRow.innerHTML = B.badges.map(b => `<div class="badge">${b}</div>`).join("");
    }

    // Links
    const phone = normPhone(B.phoneTel);
    enableLink("callBtn", phone ? `tel:${phone}` : "", B.phonePretty || "Call");
    enableLink("textBtn", phone ? `sms:\( {phone} \){B.textPrefill ? `?body=${encodeURIComponent(B.textPrefill)}` : ""}` : "", "Text");
    enableLink("websiteBtn", normUrl(B.website), "Website");

    // Shine effect
    const priceEl = $("priceValue");
    if (priceEl && !isPlaceholder(B.price)) {
      priceEl.classList.add("shine-once");
      setTimeout(() => priceEl.classList.remove("shine-once"), 1200);
    }

    // Modal
    const modal = $("modal");
    const openBtns = [ $("openModal"), $("viewBrochureBtn") ];
    const closeModal = () => {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    };

    openBtns.forEach(btn => {
      if (btn) btn.onclick = e => {
        e.preventDefault();
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
      };
    });

    if (modal) {
      modal.onclick = e => {
        if (e.target === modal || e.target.id === "modalImg") closeModal();
      };
    }

    // Ripple on all .btn
    document.querySelectorAll(".btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - size/2;
        const y = e.clientY - rect.top - size/2;

        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = x + "px";
        ripple.style.top = y + "px";
        btn.appendChild(ripple);

        ripple.addEventListener("animationend", () => ripple.remove(), {once: true});
      });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
