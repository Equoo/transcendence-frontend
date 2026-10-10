import { type InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { connection } from '@/realtime';

import type { Conversation } from '../api/conversations.api';

export function useConversationRealtime(): void {
	const qc = useQueryClient();

	useEffect(() => {
		const onConversationCreated = (conv: Conversation): void => {
			qc.setQueryData<InfiniteData<Conversation[]>>(['conversations', conv.id], old => {
				if (!old) { return old; }
				const pages = [...old.pages];
				pages[0] = [...pages[0], conv];
				return { ...old, pages };
			});
			void qc.invalidateQueries({ queryKey: ['conversations', 'list'] });
		}

		const onConversationUpdated = (id: string, conv: Conversation): void => {
			qc.setQueryData<InfiniteData<Conversation[]>>(['conversations', conv.id], old => {
				if (!old) { return old; }
				const pages = [...old.pages];
				pages[0] = [...pages[0], conv];
				return { ...old, pages };
			});
			void qc.invalidateQueries({ queryKey: ['conversations', id] });
		}

		connection.on('ConversationCreated', onConversationCreated);
		connection.on('ConversationUpdated', onConversationUpdated);

		return (): void => {
			connection.off('ConversationCreated', onConversationCreated);
			connection.off('ConversationUpdated', onConversationUpdated);
		};
	}, [qc]);
}
