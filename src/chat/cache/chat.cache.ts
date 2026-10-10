import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import type { Channel, ChannelCategory, Message } from "../api/chat.api";

export type MessagePages = InfiniteData<Message[], Date | null>;

export const chatKeys = {
	channels: ["channels"] as const,
	categories: ["categories"] as const,
	messages: (channelId: string) => ["messages", channelId] as const,
	ack: (channelId: string) => ["ack", channelId] as const,
};

const upsert = <T extends { id: string }>(items: T[], item: T): T[] =>
	items.some((it) => it.id === item.id)
		? items.map((it) => (it.id === item.id ? { ...it, ...item } : it))
		: [...items, item];

const without = <T extends { id: string }>(items: T[], id: string): T[] =>
	items.filter((it) => it.id !== id);

// Channels

export function upsertChannel(qc: QueryClient, channel: Channel): void {
	qc.setQueryData<Channel[]>(chatKeys.channels, (old) => old && upsert(old, channel));
}

export function removeChannel(qc: QueryClient, id: string): void {
	qc.setQueryData<Channel[]>(chatKeys.channels, (old) => old && without(old, id));
	qc.removeQueries({ queryKey: chatKeys.messages(id) });
	qc.removeQueries({ queryKey: chatKeys.ack(id) });
}

// Categories

export function upsertCategory(qc: QueryClient, category: ChannelCategory): void {
	qc.setQueryData<ChannelCategory[]>(chatKeys.categories, (old) => old && upsert(old, category));
}

export function removeCategory(qc: QueryClient, id: string): void {
	qc.setQueryData<ChannelCategory[]>(chatKeys.categories, (old) => old && without(old, id));
}

// Messages

const hasMessage = (data: MessagePages, id: string): boolean =>
	data.pages.some((page) => page.some((msg) => msg.id === id));

function mapPages(qc: QueryClient, channelId: string, fn: (page: Message[]) => Message[]): void {
	qc.setQueryData<MessagePages>(chatKeys.messages(channelId), (old) =>
		old && { ...old, pages: old.pages.map(fn) },
	);
}

export function findMessage(qc: QueryClient, channelId: string, id: string): Message | undefined {
	return qc
		.getQueryData<MessagePages>(chatKeys.messages(channelId))
		?.pages.flat()
		.find((msg) => msg.id === id);
}

export function addMessage(qc: QueryClient, channelId: string, message: Message): void {
	qc.setQueryData<MessagePages>(chatKeys.messages(channelId), (old) => {
		if (!old || hasMessage(old, message.id)) { return old; }
		const pages = [...old.pages];
		pages[0] = [...pages[0], message];
		return { ...old, pages };
	});
}

export function updateMessage(qc: QueryClient, channelId: string, updates: Partial<Message> & Pick<Message, "id">): void {
	mapPages(qc, channelId, (page) =>
		page.map((msg) => (msg.id === updates.id ? { ...msg, ...updates } : msg)),
	);
}

export function removeMessage(qc: QueryClient, channelId: string, id: string): void {
	mapPages(qc, channelId, (page) => without(page, id));
}

// .TODO: Some bugs on first message
export function resolvePendingMessage(
	qc: QueryClient,
	channelId: string,
	{ pendingId, message }: { pendingId: string; message: Message },
): void {
	const data = qc.getQueryData<MessagePages>(chatKeys.messages(channelId));
	if (data && hasMessage(data, message.id)) {
		removeMessage(qc, channelId, pendingId);
		return;
	}
	mapPages(qc, channelId, (page) =>
		page.map((msg) => (msg.id === pendingId ? message : msg)),
	);
}

// Read receipts

export function setAckTime(qc: QueryClient, channelId: string, ackTime: Date): void {
	qc.setQueryData<Date | null>(chatKeys.ack(channelId), ackTime);
}
