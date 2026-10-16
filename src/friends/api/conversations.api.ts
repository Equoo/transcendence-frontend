import { request, requestJson } from "@/api/request";
import { type ChannelBase, type Message, normalizeMessage } from "@/chat/api/chat.api";
import type { User } from "@/users/api/users";

export interface ConversationBody {
	name?: string;
	topic?: string;
	recipients: string[];
}

export interface Conversation extends ChannelBase {
	recipients: User[];
	lastMessage: Message | null;
}

export function normalizeConversation(conv: Conversation): Conversation {
	return {
		...conv,
		createAt: new Date(conv.createAt),
		lastMessage: conv.lastMessage && normalizeMessage(conv.lastMessage),
	};
}

export async function fetchConvs(
	limit: number,
	before?: Date | null,
): Promise<Conversation[]> {
	const url = new URL(`/api/me/conversations`, location.origin);
	url.searchParams.set("take", String(limit));
	if (before) {
		url.searchParams.set("before", before.toISOString());
	}

	const convs = await requestJson<Conversation[]>(url.toString());
	return convs.map(normalizeConversation);
}

export async function fetchConv(id: string): Promise<Conversation> {
	return normalizeConversation(
		await requestJson<Conversation>(`/api/me/conversations/${id}`),
	);
}

export async function createConv(
	conv: ConversationBody,
): Promise<Conversation> {
	return normalizeConversation(
		await requestJson<Conversation>("/api/me/conversations", "POST", conv),
	);
}

export async function deleteConv(id: string): Promise<void> {
	await request(`/api/me/conversations/${id}`, "DELETE");
}

export async function updateConv(
	id: string,
	conv: ConversationBody,
): Promise<Conversation> {
	return normalizeConversation(
		await requestJson<Conversation>(`/api/me/conversations/${id}`, "PUT", conv),
	);
}
