import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchMessages, type Message } from "../api/chat.api";
import { chatKeys, type MessagePages } from "../cache/chat.cache";

// A tall viewport may not fill on the first load.
// Request a larger first page so older messages stay reachable.
const INITIAL_PAGE_SIZE = 40;
const PAGE_SIZE = 10;

function toMessages(data: MessagePages): Message[] {
	const seen = new Set<string>();
	return data.pages.toReversed().flat()
		.filter((msg) => !seen.has(msg.id) && Boolean(seen.add(msg.id)));
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function useMessages(channelId: string) {
	return useInfiniteQuery({
		queryKey: chatKeys.messages(channelId),
		queryFn: async ({ pageParam }): Promise<Message[]> =>
			fetchMessages(channelId, pageParam ? PAGE_SIZE : INITIAL_PAGE_SIZE, pageParam),
		initialPageParam: null as Date | null,
		getNextPageParam: (lastPage) => (lastPage.length === 0 ? null : lastPage[0].sentAt),
		select: toMessages,
		staleTime: Infinity,
	});
}
