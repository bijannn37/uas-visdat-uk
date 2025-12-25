// public/js/config.js

// Daftar metrik/variabel yang digunakan dalam dashboard
export const METRICS = [
  { key: "sum",               label: "Total co‑benefit (sum) ✨",       emoji: "✨", isTotal: true },

  { key: "physical_activity", label: "Physical activity 🚶",            emoji: "🚶" },
  { key: "air_quality",       label: "Air quality 🫁",                  emoji: "🫁" },
  { key: "noise",             label: "Noise reduction 🔇",              emoji: "🔇" },
  { key: "excess_cold",       label: "Excess cold avoided 🧥",          emoji: "🧥" },
  { key: "diet_change",       label: "Diet change 🥗",                  emoji: "🥗" },
  { key: "dampness",          label: "Dampness reduced 🏠",             emoji: "🏠" },
  { key: "excess_heat",       label: "Excess heat avoided ☀️",          emoji: "☀️" },

  // Indikator negatif (Co-costs)
  { key: "congestion",        label: "Congestion (co‑cost) 🚗",         emoji: "🚗", likelyNegative: true },
  { key: "hassle_costs",      label: "Hassle costs (co‑cost) ⏱️",       emoji: "⏱️", likelyNegative: true },
  { key: "road_repairs",      label: "Road repairs (co‑cost) 🛣️",       emoji: "🛣️", likelyNegative: true },
  { key: "road_safety",       label: "Road safety (co‑cost) ⚠️",        emoji: "⚠️", likelyNegative: true }
];

// Konfigurasi margin grafik
export const MARGINS = { top: 20, right: 20, bottom: 40, left: 50 };