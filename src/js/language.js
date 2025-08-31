// public/js/language.js

// Dictionary of translations
const translations = {
  en: {
    crop: "AI Crop Doctor",
    description: "Advanced AI-powered plant disease detection with precision treatment recommendations for healthier, more productive crops",
    uploadTitle: "Upload Crop Image",
    uploadDescription: "Select or capture an image of your crop leaves for comprehensive AI analysis",
    analyzeBtn: "Analyze Crop Health",
    analyzing: "Analyzing Disease...",
    readyTitle: "Ready for Analysis",
    readyDesc: "Upload a crop image to begin AI-powered disease detection",
    history: "Analysis History",
    showHistory: "Show History",
    hideHistory: "Hide History"
  },
  rw: {
    crop: "AI Muganga w’Ibihingwa",
    description: "Ikoranabuhanga rishingiye kuri AI mu kumenya indwara z’ibihingwa no gutanga inama z’ubuvuzi zinoze kugira ngo ibihingwa byere neza kandi byinshi",
    uploadTitle: "Ohereza Ifoto y’Igihingwa",
    uploadDescription: "Hitamo cyangwa fata ifoto y’ibyuma by’uruhande rw’ibihingwa kugirango hakorwe isesengura ryimbitse rya AI",
    analyzeBtn: "Sobanura Ubuzima bw’Igihingwa",
    analyzing: "Iri gusesengura indwara...",
    readyTitle: "Biteguye Isesengura",
    readyDesc: "Ohereza ifoto y’igihingwa kugirango utangire kumenya indwara ukoresheje AI",
    history: "Amateka y’Isesengura",
    showHistory: "Erekana Amateka",
    hideHistory: "Hisha Amateka"
  }
};

// Function to switch language
function switchLanguage(lang) {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Update history button text
  const historyBtn = document.querySelector(".glass-button");
  if (historyBtn) {
    historyBtn.textContent =
      lang === "rw" ? translations.rw.showHistory : translations.en.showHistory;
  }
}

// Event listener for language buttons
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      switchLanguage(lang);
    });
  });
});
// Initialize default language