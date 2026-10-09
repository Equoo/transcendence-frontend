import { request, requestJson } from "@/api/request";
import { useChat } from "@/chat/hooks/chat.hook";
import type { User } from "@/users/api/users";

export interface Message {
	id: string;
	content: string;
	sentAt: Date;
	editAt?: Date;
	messageRef?: Message;
	sender: User;
	channel: Channel;
	status: string;
}

export function normalizeMessage(msg: Message): Message {
	return {
		...msg,
		...({
			sentAt: new Date(msg.sentAt),
			editAt: msg.editAt && new Date(msg.editAt ?? new Date()),
		} as Message),
	};
}

export interface ChannelRole {
	id: string;
	name: string;
}

export interface Channel {
	id: string;
	name: string;
	topic: string;
	createAt: Date;
	eventId?: string;
	categoryId?: string | null;
	messages: Message[];
	ackTime?: Date | null;
	rolesWhitelist: ChannelRole[];
	categorySync: boolean;
}

export interface ChannelSummary {
	id: string;
	name: string;
	createAt: Date;
}

export interface ChannelCategory {
	id: string;
	name: string;
	order: string;
	rolesWhitelist: ChannelRole[];
}

interface ChannelBody {
	name: string;
	topic: string;
	whitelistRoles: string[];
	categorySync: boolean;
	category: string | null;
}

interface CategoryBody {
	name: string;
	whitelistRoles: string[];
}

function channelBodyFromForm(formData: FormData): ChannelBody {
	const category = formData.get("category") as string | null;

	return {
		name: formData.get("Name") as string,
		topic: formData.get("Topic") as string,
		whitelistRoles: formData.getAll("Roles") as string[],
		categorySync: formData.has("Syncronised"),
		category: category === "" ? null : category,
	};
}

function categoryBodyFromForm(formData: FormData): CategoryBody {
	return {
		name: formData.get("Name") as string,
		whitelistRoles: formData.getAll("Roles") as string[],
	};
}

export async function fetchChannels(): Promise<Channel[]> {
	if (Object.keys(useChat.getState().channels).length !== 0) {
		return [];
	}

	const channels = await requestJson<Channel[]>("/api/channels");
	channels.forEach((ch) => { ch.messages = [] });

	const categories = await requestJson<ChannelCategory[]>("/api/categories");

	useChat.getState().setChannels(channels, categories);

	return channels;
}

export async function fetchMessages(
	channelId: string,
	limit: number,
	before: Date | null,
): Promise<Message[]> {
	let url = `/api/channels/${channelId}/messages?take=${limit}`;

	if (before !== null) {
		url += `&before=${before.toISOString()}`;
	}

	const raw = await requestJson<Message[]>(url);
	return raw.map((msg) => normalizeMessage(msg));
}

export async function createChannel(formData: FormData): Promise<Channel> {
	return requestJson<Channel>("/api/channels", "POST", channelBodyFromForm(formData));
}

export async function updateChannel(formData: FormData): Promise<Channel> {
	return requestJson<Channel>(
		`/api/channels/${formData.get("id") as string}`,
		"PUT",
		channelBodyFromForm(formData),
	);
}

export async function deleteChannel(id: string): Promise<void> {
	await request(`/api/channels/${id}`, "DELETE");
}

export async function createCategory(formData: FormData): Promise<ChannelCategory> {
	return requestJson<ChannelCategory>("/api/categories", "POST", categoryBodyFromForm(formData));
}

export async function updateCategory(formData: FormData): Promise<ChannelCategory> {
	return requestJson<ChannelCategory>(
		`/api/categories/${formData.get("id") as string}`,
		"PUT",
		categoryBodyFromForm(formData),
	);
}

export async function deleteCategory(id: string): Promise<void> {
	await request(`/api/categories/${id}`, "DELETE");
}

export async function sendMessage(
	channelId: string,
	content: string,
	messageReference: string | undefined,
): Promise<Message> {
	return requestJson<Message>(`/api/channels/${channelId}/messages`, "POST", {
		content,
		messageReference,
	});
}

export async function updateMessage(
	channelId: string,
	id: string,
	content: string,
): Promise<Message> {
	return requestJson<Message>(`/api/channels/${channelId}/messages/${id}`, "PUT", {
		content,
	});
}

export async function removeMessage(
	channelId: string,
	id: string,
): Promise<string> {
	const response = await request(`/api/channels/${channelId}/messages/${id}`, "DELETE");
	return response.text();
}

export async function ackMessage(channelId: string, id: string): Promise<void> {
	await request(`/api/channels/${channelId}/messages/${id}/ack`, "POST", {});
}
