/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en/translation";
import fr from "./fr/translation";
import tc from "./tc/translation";

const resources = {
	...en,
	...fr,
	...tc,
};

const supportedLanguages = ["fr", "en", "tc"] as const;

const storageKey = "language";

function readStoredLanguage(): string | null {
	try {
		return localStorage.getItem(storageKey);
	} catch {
		return null;
	}
}

function storeLanguage(lng: string): void {
	localStorage.setItem(storageKey, lng);
}

function detectLanguage(): string {
	if (typeof window === "undefined") {
		return "en";
	}

	const stored = readStoredLanguage();
	if (stored !== null && supportedLanguages.some((lng) => lng === stored)) {
		return stored;
	}

	for (const browserLanguage of navigator.languages) {
		const [prefix] = browserLanguage.toLowerCase().split("-");
		if (prefix === "fr") {
			return "fr";
		}
		if (prefix === "en") {
			return "en";
		}
		if (prefix === "zh") {
			return "tc";
		}
	}
	return "en";
}

void i18n.use(initReactI18next).init({
	resources,

	lng: detectLanguage(),
	fallbackLng: "en",

	interpolation: {
		escapeValue: false,
	},
});
i18n.use(initReactI18next);

const htmlLang: Record<string, string> = { en: "en", fr: "fr", tc: "zh-TW" };

// Keep <html lang> in sync so CSS (:lang()) and the browser pick the right
// fonts and line-breaking rules for the active language.
function syncHtmlLang(lng: string): void {
	if (typeof document !== "undefined") {
		document.documentElement.lang = htmlLang[lng] ?? "en";
	}
}

i18n.on("languageChanged", (lng) => {
	syncHtmlLang(lng);
	if (typeof window !== "undefined") {
		storeLanguage(lng);
	}
});
syncHtmlLang(i18n.language);

export default i18n;
