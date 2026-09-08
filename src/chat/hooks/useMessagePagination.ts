import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { fetchMessages } from "../api/chat.api";
import type { MessageActionBarHandles } from "../components/MessageActionBar";
import { useChat } from "./chat.hook";

const SCROLL_THRESHOLD_PX = 50;
const INITIAL_PAGE_SIZE = 40;
const PAGE_SIZE = 10;

/**
 * Loads the first page of messages for a channel and fetches older pages as
 * the user scrolls near the top, keeping the scroll position stable while
 * older messages are prepended.
 *
 * Returns the `onScroll` handler to attach to the scroll container.
 */
export function useMessagePagination(
	channelId: string,
	containerRef: RefObject<HTMLDivElement | null>,
	actionBarRef: RefObject<MessageActionBarHandles | null>,
): (ev: React.UIEvent<HTMLDivElement>) => void {
	const messages = useChat(
		useShallow((state) => Object.values(state.channels[channelId]?.messages ?? [])),
	);
	const appendMsgs = useChat((state) => state.appendMsgs);

	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const loadedChannelRef = useRef<string | null>(null);

	const loadOlder = useCallback(
		async (limit = PAGE_SIZE, initial = false): Promise<void> => {
			if (loading || !hasMore || channelId === "") { return; }
			if (initial && messages.length !== 0) { return; }

			setLoading(true);

			const el = containerRef.current;
			const prevScrollHeight = el?.scrollHeight ?? 0;

			const before = messages[0]?.sentAt ?? null;
			const older = await fetchMessages(channelId, limit, before);
			if (loadedChannelRef.current !== channelId) { return; }

			if (older.length === 0) {
				setHasMore(false);
			} else {
				appendMsgs(channelId, older);
			}
			setLoading(false);

			// Keep the viewport anchored to the same message after prepending.
			requestAnimationFrame(() => {
				if (el) {
					el.scrollTop = el.scrollHeight - prevScrollHeight;
				}
			});
		},
		[loading, hasMore, messages, channelId, appendMsgs, containerRef],
	);

	const handleScroll = useCallback(
		(ev: React.UIEvent<HTMLDivElement>): void => {
			if (ev.currentTarget.scrollTop <= SCROLL_THRESHOLD_PX) {
				void loadOlder();
			}

			actionBarRef.current?.hide();
		},
		[actionBarRef, loadOlder],
	);

	useEffect(() => {
		if (loadedChannelRef.current !== channelId) {
			loadedChannelRef.current = channelId;
			// A tall viewport may not fill on the first load.
			// Request a larger first page so older messages stay reachable.
			void loadOlder(INITIAL_PAGE_SIZE, true);
		}
	}, [channelId, loadOlder]);

	return handleScroll;
}
