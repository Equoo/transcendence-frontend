
import { useInfiniteQuery } from '@tanstack/react-query';

import { type Conversation, fetchConvs } from '../api/conversations.api';

const PAGE_SIZE = 10;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function useConversations() {
	return useInfiniteQuery({
		queryKey: ['conversations'],
		queryFn: async ({ pageParam }): Promise<Conversation[]> => fetchConvs(PAGE_SIZE, pageParam),
		initialPageParam: null as Date | null,
		getNextPageParam: (lastPage) =>
			lastPage.length < PAGE_SIZE ? null : lastPage[0].lastMessageAt ?? lastPage[0].createAt,
		staleTime: Infinity,
	});
}
