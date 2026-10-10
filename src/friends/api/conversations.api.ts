import { request, requestJson } from "@/api/request";
import type { ChannelBase } from "@/chat/api/chat.api";
import type { User } from "@/users/api/users";

export interface ConversationBody {
	name: string;
	topic: string;
	recipients: string[];
}

export interface Conversation extends ChannelBase {
	recipients: User[];
	lastMessage: string | null;
	lastMessageAt: Date | null;
}

export async function fetchConvs(limit: number, before?: Date | null): Promise<Conversation[]> {
	const url = new URL(`/api/me/conversations`, location.origin);
	url.searchParams.set('limit', String(limit));
	if (before) { url.searchParams.set('before', before.toISOString()); }

	return requestJson<Conversation[]>(url.toString());
}

export async function createConv(conv: ConversationBody): Promise<Conversation> {
	return requestJson<Conversation>("/api/me/conversations", "POST", conv);
}

export async function deleteConv(id: string): Promise<void> {
	await request(`/api/me/conversations/${id}`, "DELETE");
}

export async function updateConv(id: string, conv: ConversationBody): Promise<Conversation> {
	return requestJson<Conversation>(
		`/api/me/conversations/${id}`,
		"PUT",
		conv,
	);
}

