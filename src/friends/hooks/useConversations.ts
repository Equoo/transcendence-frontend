import { useInfiniteQuery, useMutation, type UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { toastError } from '@/utils/error.util';

import { type Conversation, type ConversationBody, createConv, deleteConv, fetchConv, fetchConvs } from '../api/conversations.api';
import { addConversation, type ConversationPages, friendsKeys, removeConversation } from '../cache/friends.cache';

const PAGE_SIZE = 10;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function useConversations() {
	return useInfiniteQuery({
		queryKey: friendsKeys.conversations,
		queryFn: async ({ pageParam }): Promise<Conversation[]> => fetchConvs(PAGE_SIZE, pageParam),
		initialPageParam: null as Date | null,
		// Pages come most recently active first: the cursor is the page's oldest activity
		getNextPageParam: (lastPage) => {
			const oldest = lastPage.at(-1);
			return !oldest || lastPage.length < PAGE_SIZE ? null : oldest.lastMessage?.sentAt ?? oldest.createAt;
		},
		staleTime: Infinity,
	});
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function useConversation(id: string | undefined) {
	const qc = useQueryClient();

	return useQuery({
		queryKey: friendsKeys.conversation(id ?? ""),
		queryFn: async () => fetchConv(id ?? ""),
		enabled: Boolean(id),
		staleTime: Infinity,
		retry: false,
		initialData: () =>
			qc.getQueryData<ConversationPages>(friendsKeys.conversations)
				?.pages.flat()
				.find((cn) => cn.id === id),
		initialDataUpdatedAt: () =>
			qc.getQueryState(friendsKeys.conversations)?.dataUpdatedAt,
	});
}

export function useStartConversation(): UseMutationResult<Conversation, Error, ConversationBody> {
	const qc = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: createConv,
		onSuccess: (conv) => {
			addConversation(qc, conv);
			void navigate(`/messages/${conv.id}`);
		},
		onError: toastError,
	});
}

export function useLeaveConversation(): UseMutationResult<void, Error, string> {
	const qc = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: deleteConv,
		onSuccess: (__, id) => {
			void navigate("/messages", { replace: true });
			removeConversation(qc, id);
		},
		onError: toastError,
	});
}
