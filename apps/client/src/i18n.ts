import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import es from "./locales/es.json";
import pt from "./locales/pt.json";

const SUPPORTED_LANGS = ["en", "es", "pt"] as const;
const DEFAULT_LANG = "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    pt: { translation: pt },
  },
  lng: DEFAULT_LANG,
  fallbackLng: DEFAULT_LANG,
  supportedLngs: SUPPORTED_LANGS,
  interpolation: {
    escapeValue: false,
  },
});

export function detectAndSetLanguage() {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem("i18nextLng");
  if (stored && SUPPORTED_LANGS.includes(stored as typeof SUPPORTED_LANGS[number])) {
    if (i18n.language !== stored) {
      i18n.changeLanguage(stored);
    }
    return;
  }

  const browserLang = navigator.language.split("-")[0];
  if (SUPPORTED_LANGS.includes(browserLang as typeof SUPPORTED_LANGS[number])) {
    i18n.changeLanguage(browserLang);
    localStorage.setItem("i18nextLng", browserLang);
  }
}

export { i18n };
