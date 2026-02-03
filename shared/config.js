// config.js
// Make should overwrite values here per order.
// Tier rules:
// - starter: CTA off
// - pro:     CTA on
// - elite:   CTA on (single CTA in this template; multiple CTAs can be added later)

window.BROCHURE_CONFIG = {
  tier: "pro", // "starter" | "pro" | "elite"

  brand: {
    company: "Select Source Water",
    product: "Hygia Whole-Home Filtration + Softener",
    watermark: "Installed by Select Source Water"
  },

  pricing: {
    label: "Total Price",
    value: "$7,990",
    note: "One-time total"
  },

  // Optional theme override (if you want per-customer color matching)
  // Remove this block entirely if you want consistent brand styling across all brochures.
  theme: {
    bgA: "#04151f",
    bgB: "#0a2f3f",
    accent: "#4fe3ff",
    accent2: "#63ffb2"
  },

  badges: [
    "Custom Dual-Tank",
    "RO + Alkaline",
    "Professional Install",
    "Lifetime Warranty"
  ],

  brochureImage: "brochure.png",

  contact: {
    phone: "12097694750",             // digits only recommended
    website: "https://selectsourcewater.com"
  },

  cta: {
    // If omitted, tier rules apply automatically.
    // You can force-enable/disable per customer by setting enabled true/false.
    enabled: true,
    label: "View Brochure"
  },

  features: [
    "Custom Built Dual Tank Whole Home Water Filtration and Softener",
    "Reverse Osmosis Alkaline System",
    "Professional Install",
    "Lifetime Warranty"
  ]
};
