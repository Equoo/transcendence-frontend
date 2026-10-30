import { useCallback, useSyncExternalStore } from "react";

const cache = new Map<string, MediaQueryList>();

function getMQL(query: string): MediaQueryList {
	let mql = cache.get(query);
	if (!mql) {
		mql = window.matchMedia(query);
		cache.set(query, mql);
	}
	return mql;
}

export function useMediaQuery(query: string): boolean {
	const subscribe = useCallback((onStoreChange: () => void): (() => void) => {
		const mql = getMQL(query);
		mql.addEventListener("change", onStoreChange);
		return (): void => { mql.removeEventListener("change", onStoreChange); };
	}, [query]);

	const getSnapshot = useCallback((): boolean => getMQL(query).matches, [query]);

	return useSyncExternalStore(subscribe, getSnapshot, (): boolean => false);
}
