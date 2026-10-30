import i18n from "i18next";

import { ChannelType } from "@/chat/api/chat.api";
import type { User } from "@/users/api/users";

import type { Conversation } from "../api/conversations.api";
import { type Relationship, RelationshipState } from "../api/relationship.api";

export function relationName(rel: Relationship): string {
	return rel.nickname ?? rel.user.userName;
}

export function displayName(user: User, rels: Relationship[] | undefined): string {
	const rel = rels?.find((rl) => rl.user.id === user.id);
	return rel ? relationName(rel) : user.userName;
}

export function isGroup(conv: Conversation): boolean {
	return conv.type === ChannelType.GroupDirectMessage;
}

export function conversationTitle(conv: Conversation, rels?: Relationship[]): string {
	if (conv.name) {
		return conv.name;
	}
	if (conv.recipients.length === 0) {
		return i18n.t("friends.emptyConversation");
	}
	return conv.recipients.map((us) => displayName(us, rels)).join(", ");
}

export const lastActivity = (conv: Conversation): number =>
	(conv.lastMessage?.sentAt ?? conv.createAt).getTime();

export const isFriend = (rel: Relationship): boolean =>
	rel.type === RelationshipState.Friend;

export const isPending = (rel: Relationship): boolean =>
	rel.type === RelationshipState.PendingRequest ||
	rel.type === RelationshipState.PendingResponse;

export const isBlocked = (rel: Relationship): boolean =>
	rel.type === RelationshipState.Blocked;

export function matchesSearch(text: string, search: string): boolean {
	return text.toLowerCase().includes(search.trim().toLowerCase());
}
