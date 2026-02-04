// shared/config.js
// This file is the ONLY thing Make needs to edit per customer.
//
// Tier rules (also testable with URL):
// - starter: no action buttons
// - pro:     Text + Call + Email + Website
// - elite:   Pro buttons + Request More Info + Social Proof + Advanced Embed
//
// Test overrides (does NOT change saved config):
//   ?tier=starter
//   ?tier=pro
//   ?tier=elite

window.BROCHURE_CONFIG = {
  tier: "pro", // "starter" | "pro" | "elite"

  brand: {
    company: "Select Source Water",
    product: "Hygia Whole-Home Filtration + Softener",
    watermark: "Installed by Select Source Water"
  },

  pricing: {
    label: "Pricing",
    value: "Your Price Here",
    note: "Based on Your Home & Setup"
  },

  // Optional theme override (leave as-is for your main brand look)
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

  // ✅ You renamed the image to product.png
  // (shared.js will also accept brochureImage, but productImage is preferred now)
  productImage: "product.png",

  contact: {
    phone: "12097694750",                  // digits recommended
    email: "info@selectsourcewater.com",    // <- change per customer scenario if needed
    website: "https://selectsourcewater.com"
  },

  // ✅ Elite-only extras live here
  elite: {
    // Shows as a button ONLY when tier=elite AND URL is provided
    requestInfoUrl: "https://selectsourcewater.com/intake",

    // Social proof cards (Elite only)
    socialProof: [
      { text: "Install was quick and the water tastes incredible.", name: "Homeowner" },
      { text: "We noticed the difference immediately—highly recommend.", name: "Referral Partner" }
    ],

    // Advanced embed (Elite only) — choose ONE option:
    // Option A (recommended): embedUrl for a video, form, calendar, etc.
    // Option B: embedHtml for custom embed code you fully control.

    // Option A:
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"

    // Option B (example):
    // embedHtml: '<div style="padding:14px;border:1px solid rgba(255,255,255,.10);border-radius:14px;background:rgba(0,0,0,.12)">Custom embed HTML here</div>'
  },

  features: [
    "Custom Built Dual Tank Whole Home Water Filtration and Softener",
    "Reverse Osmosis Alkaline System",
    "Professional Install",
    "Lifetime Warranty"
  ]
};
