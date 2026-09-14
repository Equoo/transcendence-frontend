import { type RefObject, useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";

import { useUser } from "@/users/hooks/users.hooks";

import { ackMessage, type Channel } from "../api/chat.api";
import { useChat } from "./chat.hook";

const ACK_DEBOUNCE_MS = 800;

/**
 * Acknowledges the latest message from other users once it is fully visible
 * and the tab is focused, debouncing rapid visibility changes.
 *
 * Returns a ref to attach to the last rendered message.
 */
export function useReadReceipts(
	channelId: string,
): RefObject<HTMLDivElement | null> {
	const user = useUser();
	const messages = useChat(
		useShallow((state) => Object.values(state.channels[channelId]?.messages ?? [])),
	);
	const ackDate = useChat(
		useShallow((state) => state.channels[channelId]?.ackTime ?? null),
	);
	const updateChannel = useChat(useShallow((state) => state.updateChannel));

	const lastMessageRef = useRef<HTMLDivElement>(null);
	const pendingAckRef = useRef<{ msgId: string; sentAt: Date } | null>(null);
	const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isIntersectingRef = useRef(false);

	const scheduleAck = useCallback(
		(msgId: string, sentAt: Date): void => {
			pendingAckRef.current = { msgId, sentAt };

			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
			debounceTimerRef.current = setTimeout(() => {
				const pending = pendingAckRef.current;
				if (!pending) { return; }
				void ackMessage(channelId, pending.msgId);
				updateChannel(channelId, {
					ackTime: pending.sentAt,
				} as unknown as Channel);
				pendingAckRef.current = null;
			}, ACK_DEBOUNCE_MS);
		},
		[channelId, updateChannel],
	);

	const tryAck = useCallback((): void => {
		if (!isIntersectingRef.current) { return; }
		if (document.visibilityState !== "visible" || !document.hasFocus()) {
			return;
		}

		const lastMsg = messages.findLast((msg) => msg.sender.id !== user?.id);
		if (!lastMsg) { return; }
		if (ackDate && ackDate >= lastMsg.sentAt) { return; }

		scheduleAck(lastMsg.id, lastMsg.sentAt);
	}, [messages, ackDate, user, scheduleAck]);

	useEffect((): (() => void) => {
		const el = lastMessageRef.current;
		// eslint-disable-next-line no-inline-comments
		if (!el) { return (): void => { /* Empty */ }; }

		const observer = new IntersectionObserver(
			([entry]) => {
				isIntersectingRef.current = entry.isIntersecting;
				tryAck();
			},
			{ threshold: 1 },
		);
		observer.observe(el);
		return (): void => { observer.disconnect(); };
	}, [tryAck]);

	useEffect(() => {
		const onFocusChange = (): void => { tryAck(); };
		window.addEventListener("focus", onFocusChange);
		document.addEventListener("visibilitychange", onFocusChange);
		return (): void => {
			window.removeEventListener("focus", onFocusChange);
			document.removeEventListener("visibilitychange", onFocusChange);
		};
	}, [tryAck]);

	return lastMessageRef;
}
