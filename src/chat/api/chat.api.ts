import { request, requestJson } from "@/api/request";
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

export enum ChannelType {
	Text = 0,
	DirectMessage = 1,
	GroupDirectMessage = 2
}

export interface ChannelBase {
	id: string;
	name: string;
	topic: string;
	createAt: Date;
}

export interface Channel extends ChannelBase {
	eventId?: string;
	categoryId?: string | null;
	type: ChannelType;
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

export interface ChannelBody {
	name: string;
	topic: string;
	whitelistRoles: string[];
	categorySync: boolean;
	category: string | null;
}

export interface CategoryBody {
	name: string;
	whitelistRoles: string[];
}

export async function fetchChannels(): Promise<Channel[]> {
	return requestJson<Channel[]>("/api/channels");
}

export async function fetchCategories(): Promise<ChannelCategory[]> {
	return requestJson<ChannelCategory[]>("/api/categories");
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

export async function createChannel(channel: ChannelBody): Promise<Channel> {
	return requestJson<Channel>("/api/channels", "POST", channel);
}

export async function updateChannel(id: string, channel: ChannelBody): Promise<Channel> {
	return requestJson<Channel>(
		`/api/channels/${id}`,
		"PUT",
		channel,
	);
}

export async function deleteChannel(id: string): Promise<void> {
	await request(`/api/channels/${id}`, "DELETE");
}

export async function createCategory(category: CategoryBody): Promise<ChannelCategory> {
	return requestJson<ChannelCategory>("/api/categories", "POST", category);
}

export async function updateCategory(id: string, category: CategoryBody): Promise<ChannelCategory> {
	return requestJson<ChannelCategory>(
		`/api/categories/${id}`,
		"PUT",
		category,
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

export async function deleteMessage(
	channelId: string,
	id: string,
): Promise<string> {
	const response = await request(`/api/channels/${channelId}/messages/${id}`, "DELETE");
	return response.text();
}

export async function ackMessage(channelId: string, id: string): Promise<void> {
	await request(`/api/channels/${channelId}/messages/${id}/ack`, "POST", {});
}
