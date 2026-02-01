// /shared/shared.js
(function () {
  "use strict";

document.documentElement.setAttribute("data-tier", (window.BIZ?.tier || "starter"));
  
  // --- Helpers ---
  const B = window.BIZ || {};
  const qs = (sel, root) => (root || document).querySelector(sel);

  const safe = (v, fallback = "") => {
    if (v === undefined || v === null) return fallback;
    const s = String(v).trim();
    return s.length ? s : fallback;
  };

  const setText = (idOrSel, value, fallback = "") => {
    const el = idOrSel.startsWith("#") || idOrSel.startsWith(".")
      ? qs(idOrSel)
      : document.getElementById(idOrSel);

    if (!el) return;
    el.textContent = safe(value, fallback);
  };

  const setHTML = (idOrSel, html) => {
    const el = idOrSel.startsWith("#") || idOrSel.startsWith(".")
      ? qs(idOrSel)
      : document.getElementById(idOrSel);

    if (!el) return;
    el.innerHTML = html;
  };

  const setHref = (idOrSel, url, { disableIfMissing = true } = {}) => {
    const el = idOrSel.startsWith("#") || idOrSel.startsWith(".")
      ? qs(idOrSel)
      : document.getElementById(idOrSel);

    if (!el) return;

    const u = safe(url);
    if (!u) {
      if (disableIfMissing) {
        el.setAttribute("aria-disabled", "true");
        el.style.pointerEvents = "none";
        el.style.opacity = "0.45";
        el.removeAttribute("href");
      }
      return;
    }

    el.setAttribute("aria-disabled", "false");
    el.style.pointerEvents = "";
    el.style.opacity = "";
    el.href = u;
  };

  const setMailto = (idOrSel, email, subject = "") => {
    const e = safe(email);
    if (!e) return;
    const subj = encodeURIComponent(safe(subject));
    const href = `mailto:${e}${subj ? `?subject=${subj}` : ""}`;
    setHref(idOrSel, href, { disableIfMissing: false });
  };

  const setTel = (idOrSel, phoneTel) => {
    const p = safe(phoneTel);
    if (!p) return;
    setHref(idOrSel, `tel:${p}`, { disableIfMissing: false });
  };

  const setSms = (idOrSel, phoneTel, body) => {
    const p = safe(phoneTel);
    if (!p) return;
    const b = encodeURIComponent(safe(body));
    // Android: sms:+1555...?body= ; iOS also supports body in many cases
    const href = `sms:${p}${b ? `?body=${b}` : ""}`;
    setHref(idOrSel, href, { disableIfMissing: false });
  };

  const titleCaseTier = (tier) => {
    const t = safe(tier, "starter").toLowerCase();
    if (t === "pro") return "Pro";
    if (t === "elite") return "Elite";
    return "Starter";
  };

  // --- Apply config to page ---
  function apply() {
    const tier = safe(B.tier, "starter").toLowerCase();
    const tierLabel = titleCaseTier(tier);

    // ===== SEO / Title =====
    // If your template has <title> set, we override it with something personal:
    const name = safe(B.fullName);
    const company = safe(B.company);
    const city = safe(B.city);

    const docTitle = name
      ? `${name} | ${company || "Digital Brochure"}${city ? " • " + city : ""}`
      : `${company || "Digital Brochure"}${city ? " • " + city : ""}`;
    if (docTitle.trim()) document.title = docTitle;

    // ===== Basic text fields =====
    // These require you to have matching IDs in your brochure template.
    // (If an element doesn’t exist yet, nothing breaks.)
    setText("fullName", B.fullName);
    setText("company", B.company);
    setText("city", B.city);
    setText("title", B.title);

    // Phone/email/website display text (pretty)
    setText("phonePretty", B.phonePretty);
    setText("emailText", B.email);
    setText("websiteText", B.website);

    // ===== Links (IDs you should use in the brochure template) =====
    setTel("callBtn", B.phoneTel);
    setSms("textBtn", B.phoneTel, B.textPrefill);
    setMailto("emailBtn", B.email, "Quick question");
    setHref("websiteBtn", B.website, { disableIfMissing: true });

    // Booking button: only enable if present + link provided
    setHref("bookBtn", B.bookingLink, { disableIfMissing: true });

    // ===== Tier gating =====
    // You can tag blocks with:
    //   data-tier="pro"  (show for pro+elite)
    //   data-tier="elite" (show only for elite)
    // Anything without data-tier is always visible.
    const tierRank = (t) => (t === "elite" ? 3 : t === "pro" ? 2 : 1);
    const currentRank = tierRank(tier);

    document.querySelectorAll("[data-tier]").forEach((el) => {
      const required = safe(el.getAttribute("data-tier")).toLowerCase();
      const requiredRank = tierRank(required);
      const show = currentRank >= requiredRank;
      el.style.display = show ? "" : "none";
    });

    // ===== Elite-only CTA slot =====
    // Put an element in HTML with id="eliteCtaWrap" containing a link id="eliteCtaBtn"
    // This will auto-hide unless tier=elite AND both label+url exist.
    const eliteWrap = document.getElementById("eliteCtaWrap");
    const eliteBtn = document.getElementById("eliteCtaBtn");
    const eliteLabel = safe(B.eliteCtaLabel);
    const eliteUrl = safe(B.eliteCtaUrl);

    if (eliteWrap) {
      const shouldShow = tier === "elite" && eliteLabel && eliteUrl;
      eliteWrap.style.display = shouldShow ? "" : "none";
      if (shouldShow && eliteBtn) {
        eliteBtn.textContent = eliteLabel;
        eliteBtn.href = eliteUrl;
      }
    }

    // ===== Optional tier badge text =====
    // If you add <span id="tierBadge"></span> anywhere, it’ll show Starter/Pro/Elite
    setText("tierBadge", tierLabel);
  }

  // Run after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
