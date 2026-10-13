import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import { chatKeys } from "@/chat/cache/chat.cache";
import { upsert, without } from "@/utils/cache.util";

import type { Conversation } from "../api/conversations.api";
import type { Relationship } from "../api/relationship.api";

export type ConversationPages = InfiniteData<Conversation[], Date | null>;

export const friendsKeys = {
	conversations: ["conversations", "list"] as const,
	relations: ["relations"] as const,
	conversation: (convId: string) =>
		["conversations", "detail", convId] as const,
	users: ["users"] as const,
};

// Conversations

const hasConversation = (data: ConversationPages, id: string): boolean =>
	data.pages.some((page) => page.some((conv) => conv.id === id));

function mapConvPages(
	qc: QueryClient,
	fn: (page: Conversation[]) => Conversation[],
): void {
	qc.setQueryData<ConversationPages>(
		friendsKeys.conversations,
		(old) => old && { ...old, pages: old.pages.map(fn) },
	);
}

export function addConversation(
	qc: QueryClient,
	conversation: Conversation,
): void {
	qc.setQueryData<ConversationPages>(friendsKeys.conversations, (old) => {
		if (!old || hasConversation(old, conversation.id)) {
			return old;
		}
		const pages = [...old.pages];
		pages[0] = [conversation, ...pages[0]];
		return { ...old, pages };
	});
	qc.setQueryData<Conversation>(
		friendsKeys.conversation(conversation.id),
		conversation,
	);
}

export function updateConversation(
	qc: QueryClient,
	updates: Partial<Conversation> & Pick<Conversation, "id">,
): void {
	mapConvPages(qc, (page) =>
		page.map((conv) =>
			conv.id === updates.id ? { ...conv, ...updates } : conv,
		),
	);
	qc.setQueryData<Conversation>(
		friendsKeys.conversation(updates.id),
		(old) => old && { ...old, ...updates },
	);
}

export function removeConversation(qc: QueryClient, id: string): void {
	mapConvPages(qc, (page) => without(page, id));
	qc.removeQueries({ queryKey: friendsKeys.conversation(id) });
	qc.removeQueries({ queryKey: chatKeys.messages(id) });
	qc.removeQueries({ queryKey: chatKeys.ack(id) });
}

export function removeConversationMember(
	qc: QueryClient,
	id: string,
	userId: string,
): void {
	const strip = (conv: Conversation): Conversation => ({
		...conv,
		recipients: without(conv.recipients, userId),
	});
	mapConvPages(qc, (page) =>
		page.map((conv) => (conv.id === id ? strip(conv) : conv)),
	);
	qc.setQueryData<Conversation>(
		friendsKeys.conversation(id),
		(old) => old && strip(old),
	);
}

// Relationships

export function upsertRelationship(qc: QueryClient, rel: Relationship): void {
	qc.setQueryData<Relationship[]>(
		friendsKeys.relations,
		(old) => old && upsert(old, rel),
	);
}

export function removeRelationship(qc: QueryClient, userId: string): void {
	qc.setQueryData<Relationship[]>(
		friendsKeys.relations,
		(old) => old?.filter((rel) => rel.user.id !== userId),
	);
}
