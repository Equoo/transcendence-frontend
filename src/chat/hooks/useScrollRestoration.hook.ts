import { type RefObject, useEffect } from "react";

import { useChatContext } from "../components/ChatProvider";

export function useScrollRestoration(
	channelId: string,
	containerRef: RefObject<HTMLDivElement | null>,
	ready: boolean,
): void {
	const { scrollRef } = useChatContext();

	useEffect(() => {
		const el = containerRef.current;
		// eslint-disable-next-line no-inline-comments
		if (!el || !ready) { return (): void => { /* Empty */ }; }

		el.scrollTop = scrollRef.current.get(channelId) ?? el.scrollHeight;

		const persist = (): void => {
			scrollRef.current.set(channelId, el.scrollTop);
		};
		el.addEventListener("scroll", persist, { passive: true });
		return (): void => { el.removeEventListener("scroll", persist); };
	}, [channelId, containerRef, scrollRef, ready]);
}
