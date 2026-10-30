import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getConnection } from '@/realtime';

import { type Conversation, normalizeConversation } from '../api/conversations.api';
import { addConversation, removeConversation, removeConversationMember } from '../cache/friends.cache';

export function useConversationRealtime(): void {
	const qc = useQueryClient();

	useEffect(() => {
		const connection = getConnection();
		const onNewConversation = (conv: Conversation): void => {
			addConversation(qc, normalizeConversation(conv));
		};
		const onRemoveConversation = (id: string): void => {
			removeConversation(qc, id);
		};
		const onMemberLeft = (id: string, userId: string): void => {
			removeConversationMember(qc, id, userId);
		};

		connection.on('NewConversation', onNewConversation);
		connection.on('RemoveConversation', onRemoveConversation);
		connection.on('ConversationMemberLeft', onMemberLeft);

		return (): void => {
			connection.off('NewConversation', onNewConversation);
			connection.off('RemoveConversation', onRemoveConversation);
			connection.off('ConversationMemberLeft', onMemberLeft);
		};
	}, [qc]);
}
