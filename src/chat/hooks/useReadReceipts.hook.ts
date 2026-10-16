import { useQueryClient } from "@tanstack/react-query";
import { type RefObject, useCallback, useEffect, useRef } from "react";

import { useUser } from "@/users/hooks/users";

import { ackMessage, type Message } from "../api/chat.api";
import { setAckTime } from "../cache/chat.cache";
import { useAckTime } from "./useChannels";

const ACK_DEBOUNCE_MS = 800;

export function useReadReceipts(
	channelId: string,
	messages: Message[],
): RefObject<HTMLDivElement | null> {
	const user = useUser();
	const qc = useQueryClient();
	const ackDate = useAckTime(channelId);

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
				if (!pending) {
					return;
				}
				void ackMessage(channelId, pending.msgId);
				setAckTime(qc, channelId, pending.sentAt);
				pendingAckRef.current = null;
			}, ACK_DEBOUNCE_MS);
		},
		[channelId, qc],
	);

	const tryAck = useCallback((): void => {
		if (!isIntersectingRef.current) {
			return;
		}
		if (document.visibilityState !== "visible" || !document.hasFocus()) {
			return;
		}

		const lastMsg = messages.findLast((msg) => msg.sender.id !== user?.id);
		if (!lastMsg) {
			return;
		}
		if (ackDate && ackDate >= lastMsg.sentAt) {
			return;
		}

		scheduleAck(lastMsg.id, lastMsg.sentAt);
	}, [messages, ackDate, user, scheduleAck]);

	useEffect((): (() => void) => {
		const el = lastMessageRef.current;
		if (!el) {
			return (): void => {
				/* Empty */
			};
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				isIntersectingRef.current = entry.isIntersecting;
				tryAck();
			},
			{ threshold: 1 },
		);
		observer.observe(el);
		return (): void => {
			observer.disconnect();
		};
	}, [tryAck]);

	useEffect(() => {
		const onFocusChange = (): void => {
			tryAck();
		};
		window.addEventListener("focus", onFocusChange);
		document.addEventListener("visibilitychange", onFocusChange);
		return (): void => {
			window.removeEventListener("focus", onFocusChange);
			document.removeEventListener("visibilitychange", onFocusChange);
		};
	}, [tryAck]);

	return lastMessageRef;
}
