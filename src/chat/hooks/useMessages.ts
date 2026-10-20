import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import {
	fetchMessages,
	type Message,
	type MessageCursor,
} from "../api/chat.api";
import {
	chatKeys,
	type MessagePages,
	MESSAGES_PAGE_SIZE,
	newerCursor,
	olderCursor,
} from "../cache/chat.cache";

//.TODO: A tall viewport may not fill on the first load.
// Request a larger first page so older messages stay reachable.
const INITIAL_PAGE_SIZE = 40;

function toMessages(data: MessagePages): Message[] {
	const seen = new Set<string>();
	return data.pages
		.toReversed()
		.flat()
		.filter((msg) => !seen.has(msg.id) && Boolean(seen.add(msg.id)));
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function useMessages(channelId: string) {
	return useInfiniteQuery({
		queryKey: chatKeys.messages(channelId),
		queryFn: async ({ pageParam }): Promise<Message[]> =>
			fetchMessages(
				channelId,
				pageParam === null || "around" in pageParam
					? INITIAL_PAGE_SIZE
					: MESSAGES_PAGE_SIZE,
				pageParam,
			),
		initialPageParam: null as MessageCursor,
		getNextPageParam: olderCursor,
		getPreviousPageParam: (firstPage, __, firstPageParam) =>
			newerCursor(firstPage, firstPageParam),
		select: toMessages,
		staleTime: Infinity,
		// Only a failed first load reaches the ErrorBoundary, older pages are toasted
		throwOnError: (__, query) => typeof query.state.data === "undefined",
	});
}

/** Replaces the loaded messages with a window centered on `date`. */
export function useLoadMessagesAround(
	channelId: string,
): (date: Date) => Promise<void> {
	const qc = useQueryClient();

	return useCallback(
		async (date: Date): Promise<void> => {
			const cursor: MessageCursor = { around: date };
			const page = await fetchMessages(
				channelId,
				INITIAL_PAGE_SIZE,
				cursor,
			);
			const queryKey = chatKeys.messages(channelId);
			await qc.cancelQueries({ queryKey });
			qc.setQueryData<MessagePages>(queryKey, {
				pages: [page],
				pageParams: [cursor],
			});
		},
		[qc, channelId],
	);
}
