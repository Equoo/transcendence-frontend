import { type RefObject, useCallback, useEffect, useLayoutEffect, useRef } from "react";

export interface UseScrollPaginationOptions {
	containerRef: RefObject<HTMLElement | null>;
	fetchNextPage: () => Promise<unknown>;
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	direction?: "up" | "down";
	threshold?: number;
	enabled?: boolean;
	resetKey?: unknown;
}

export function useScrollPagination({
	containerRef,
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
	direction = "down",
	threshold = 50,
	enabled = true,
	resetKey,
}: UseScrollPaginationOptions): (ev: React.UIEvent<HTMLElement>) => void {
	const inFlightRef = useRef(false);
	const anchorRef = useRef<{ scrollHeight: number; scrollTop: number } | null>(null);

	const loadMore = useCallback((): void => {
		const el = containerRef.current;
		if (!el || !enabled || !hasNextPage || isFetchingNextPage || inFlightRef.current) { return; }

		inFlightRef.current = true;
		if (direction === "up") {
			anchorRef.current = { scrollHeight: el.scrollHeight, scrollTop: el.scrollTop };
		}
		void fetchNextPage();
	}, [containerRef, enabled, hasNextPage, isFetchingNextPage, direction, fetchNextPage]);

	useLayoutEffect(() => {
		if (isFetchingNextPage) { return; }
		inFlightRef.current = false;

		const el = containerRef.current;
		const an = anchorRef.current;
		anchorRef.current = null;
		if (el && an) {
			el.scrollTop = el.scrollHeight - an.scrollHeight + an.scrollTop;
		}
	}, [isFetchingNextPage, containerRef]);

	useEffect(() => {
		const el = containerRef.current;
		if (!el || isFetchingNextPage) { return; }
		if (el.scrollHeight <= el.clientHeight + threshold) {
			loadMore();
		}
	}, [containerRef, isFetchingNextPage, hasNextPage, threshold, loadMore, resetKey]);

	useEffect(() => {
		inFlightRef.current = false;
		anchorRef.current = null;
	}, [resetKey]);

	return useCallback((ev: React.UIEvent<HTMLElement>): void => {
		const el = ev.currentTarget;
		const nearEdge = direction === "up"
			? el.scrollTop <= threshold
			: el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
		if (nearEdge) { loadMore(); }
	}, [direction, threshold, loadMore]);
}
