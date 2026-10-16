import { toast } from "react-toastify";

import { APIError } from "@/api/problem_detail";
import Alert from "@/components/Alert";
import type { User } from "@/users/api/users";

import type { Conversation } from "../api/conversations.api";
import { type Relationship, RelationshipState } from "../api/relationship.api";

export function toastError(err: Error): void {
	toast(Alert, {
		type: "error",
		data: err instanceof APIError
			? { title: err.problem.title, detail: err.problem.detail }
			: { title: "Something went wrong", detail: err.message },
	});
}

export function relationName(rel: Relationship): string {
	return rel.nickname ?? rel.user.userName;
}

export function displayName(user: User, rels: Relationship[] | undefined): string {
	const rel = rels?.find((rl) => rl.user.id === user.id);
	return rel ? relationName(rel) : user.userName;
}

export function isGroup(conv: Conversation): boolean {
	return conv.recipients.length !== 1;
}

export function conversationTitle(conv: Conversation, rels?: Relationship[]): string {
	if (conv.name) {
		return conv.name;
	}
	if (conv.recipients.length === 0) {
		return "Empty conversation";
	}
	return conv.recipients.map((us) => displayName(us, rels)).join(", ");
}

/** Timestamp of the latest message, or of the creation if there is none. */
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
