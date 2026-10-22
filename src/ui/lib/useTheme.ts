import { useSyncExternalStore } from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "kg-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

const listeners = new Set<() => void>();
let preference: ThemePreference | null = null;

function readStored(): ThemePreference {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === "light" || stored === "dark" || stored === "system") {
			return stored;
		}
	} catch {
		// Storage can be blocked (private mode): fall back to default
	}
	return "light";
}

function current(): ThemePreference {
	preference ??= readStored();
	return preference;
}

function resolve(pref: ThemePreference): ResolvedTheme {
	if (pref === "system") {
		return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
	}
	return pref;
}

function apply(): void {
	document.documentElement.dataset.theme = resolve(current());
	for (const listener of listeners) {
		listener();
	}
}

export function setThemePreference(pref: ThemePreference): void {
	preference = pref;
	try {
		localStorage.setItem(STORAGE_KEY, pref);
	} catch {
		// Not persisted, still applied for this session
	}
	apply();
}

/** Applies the stored theme and follows the OS when set to "system". Call once at startup. */
export function initTheme(): void {
	apply();
	window.matchMedia(DARK_QUERY).addEventListener("change", () => {
		if (current() === "system") {
			apply();
		}
	});
}

function subscribe(listener: () => void): () => void {
	listeners.add(listener);
	return (): void => {
		listeners.delete(listener);
	};
}

export function useTheme(): {
	preference: ThemePreference;
	resolved: ResolvedTheme;
	setPreference: (pref: ThemePreference) => void;
} {
	const pref = useSyncExternalStore(
		subscribe,
		current,
		(): ThemePreference => "light",
	);
	return {
		preference: pref,
		resolved: typeof window === "undefined" ? "light" : resolve(pref),
		setPreference: setThemePreference,
	};
}
