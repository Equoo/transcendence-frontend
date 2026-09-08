import { type RefObject, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { usePrevious } from "@/hooks/usePrevious";

import type { Message } from "../api/chat.api";
import { useChat } from "./chat.hook";

const NEAR_BOTTOM_PX = 150;
const SCROLL_DELAY_MS = 100;

async function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

/**
 * Exposes `scrollToBottom` and automatically follows new messages, but only
 * when the viewport is already close to the bottom.
 */
export function useAutoScroll(
	channelId: string,
	containerRef: RefObject<HTMLDivElement | null>,
): { scrollToBottom: () => void } {
	const messages = useChat(
		useShallow((state) => Object.values(state.channels[channelId]?.messages ?? [])),
	);
	const prevMessages = usePrevious(messages) as Message[] | null;

	const scrollToBottom = (): void => {
		const el = containerRef.current;
		if (!el) { return; }
		void sleep(SCROLL_DELAY_MS).then(() => {
			el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
		});
	};

	useEffect(() => {
		const lastId = messages[messages.length - 1]?.id;
		const prevLastId = prevMessages?.[prevMessages.length - 1]?.id;
		if (!prevMessages || prevLastId === lastId) { return; }

		const el = containerRef.current;
		if (!el) { return; }

		const distanceFromBottom =
			el.scrollHeight - el.scrollTop - el.clientHeight;
		if (distanceFromBottom < NEAR_BOTTOM_PX) {
			scrollToBottom();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messages, prevMessages]);

	return { scrollToBottom };
}
