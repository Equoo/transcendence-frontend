
import { type InfiniteData, useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';

import { type Conversation, fetchConv, fetchConvs } from '../api/conversations.api';

const PAGE_SIZE = 10;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function useConversations() {
	return useInfiniteQuery({
		queryKey: ['conversations', 'list'],
		queryFn: async ({ pageParam }): Promise<Conversation[]> => fetchConvs(PAGE_SIZE, pageParam),
		initialPageParam: null as Date | null,
		getNextPageParam: (lastPage) =>
			lastPage.length < PAGE_SIZE ? null : lastPage[0].lastMessage?.sentAt ?? lastPage[0].createAt,
		staleTime: Infinity,
	});
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function useConversation(id: string | undefined) {
	const qc = useQueryClient();

	return useQuery({
		queryKey: ["conversations", "detail", id],
		queryFn: async () => fetchConv(id ?? ""),
		enabled: Boolean(id),
		staleTime: Infinity,
		// Seed from the list if this conversation is already loaded there
		initialData: () =>
			qc.getQueryData<InfiniteData<Conversation[]>>(["conversations", "list"])
				?.pages.flat()
				.find((cn) => cn.id === id),
		initialDataUpdatedAt: () =>
			qc.getQueryState(["conversations", "list"])?.dataUpdatedAt,
	});
}
