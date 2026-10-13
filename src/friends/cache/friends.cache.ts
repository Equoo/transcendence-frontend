import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import { chatKeys } from "@/chat/cache/chat.cache";
import { without } from "@/utils/cache.util";

import type { Conversation } from "../api/conversations.api";

export type ConversationPages = InfiniteData<Conversation[], Date | null>;

export const friendsKeys = {
	conversations: ["conversations", "list"] as const,
	relations: ["relations"] as const,
	conversation: (convId: string) =>
		["conversations", "detail", convId] as const,
	relation: (relationId: string) => ["relations", relationId] as const,
};

// Conversations

const hasConversation = (data: ConversationPages, id: string): boolean =>
	data.pages.some((page) => page.some((msg) => msg.id === id));

function mapConvPages(
	qc: QueryClient,
	conversationId: string,
	fn: (page: Conversation[]) => Conversation[],
): void {
	qc.setQueryData<ConversationPages>(
		friendsKeys.conversation(conversationId),
		(old) => old && { ...old, pages: old.pages.map(fn) },
	);
}

export function addConversation(
	qc: QueryClient,
	conversationId: string,
	conversation: Conversation,
): void {
	qc.setQueryData<ConversationPages>(
		friendsKeys.conversation(conversationId),
		(old) => {
			if (!old || hasConversation(old, conversation.id)) {
				return old;
			}
			const pages = [...old.pages];
			pages[0] = [...pages[0], conversation];
			return { ...old, pages };
		},
	);
}

export function updateConversation(
	qc: QueryClient,
	conversationId: string,
	updates: Partial<Conversation> & Pick<Conversation, "id">,
): void {
	mapConvPages(qc, conversationId, (page) =>
		page.map((msg) =>
			msg.id === updates.id ? { ...msg, ...updates } : msg,
		),
	);
}

export function removeConversation(
	qc: QueryClient,
	conversationId: string,
	id: string,
): void {
	mapConvPages(qc, conversationId, (page) => without(page, id));
	qc.removeQueries({ queryKey: chatKeys.messages(id) });
	qc.removeQueries({ queryKey: chatKeys.ack(id) });
}
