// shared/config.js
// Make should overwrite values here per customer.
//
// Tier rules:
// - starter: buttons OFF
// - pro:     Text/Call/Email/Website ON
// - elite:   Pro buttons + Primary CTA + Social Proof + Advanced Embedded Content

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

  // Optional theme override (keep consistent unless you really need custom)
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

  // IMPORTANT: this is the image file in the repo root
  productImage: "product.png",

  contact: {
    phone: "12097694750",                 // digits only recommended
    email: "info@selectsourcewater.com",  // change per customer scenario if needed
    website: "https://selectsourcewater.com"
  },

  // Elite-only Primary CTA (goes to the customer's intake form / booking page)
  primaryCta: {
    enabled: true,
    label: "Request More Info",
    url: "https://selectsourcewater.com/intake" // must be https://
  },

  features: [
    "Custom Built Dual Tank Whole Home Water Filtration and Softener",
    "Reverse Osmosis Alkaline System",
    "Professional Install",
    "Lifetime Warranty"
  ],

  // Elite-only Social Proof (optional)
  testimonials: [
    "“Night and day difference — water tastes incredible.”",
    "“Install was clean and professional. Great experience.”",
    "“Hard water issues gone. Worth it.”"
  ],

  // Elite-only Advanced Embedded Content (optional)
  // Only https:// URLs will render.
  // Great for: YouTube/Vimeo demo, Google Maps, embedded form pages, etc.
  embeds: [
    // { title: "Quick System Demo", src: "https://www.youtube.com/embed/VIDEO_ID", height: 360 },
    // { title: "Service Area Map",  src: "https://www.google.com/maps/embed?pb=...", height: 360 },
    // { title: "Intake Form",       src: "https://yourdomain.com/embed/intake", height: 520 }
  ]
};
