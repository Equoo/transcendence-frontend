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

void i18n.use(initReactI18next).init({
	// the translations
	// (tip move them in a JSON file and import them,
	// or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
	resources,

	lng: "en",
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

i18n.on("languageChanged", syncHtmlLang);
syncHtmlLang(i18n.language);

export default i18n;
