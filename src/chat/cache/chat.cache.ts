import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import { updateConversation } from "@/friends/cache/friends.cache";
import { upsert, without } from "@/utils/cache.util";

import type {
	Channel,
	ChannelCategory,
	Message,
	MessageCursor,
} from "../api/chat.api";

// Pages are ordered newest first: "next" pages are older, "previous" are newer.
// A null cursor on the first page means the window reaches the latest message.
export type MessagePages = InfiniteData<Message[], MessageCursor>;

export const MESSAGES_PAGE_SIZE = 10;

export const chatKeys = {
	channels: ["channels"] as const,
	categories: ["categories"] as const,
	messages: (channelId: string) => ["messages", channelId] as const,
	ack: (channelId: string) => ["ack", channelId] as const,
};

// Channels

export function upsertChannel(qc: QueryClient, channel: Channel): void {
	qc.setQueryData<Channel[]>(
		chatKeys.channels,
		(old) => old && upsert(old, channel),
	);
}

export function removeChannel(qc: QueryClient, id: string): void {
	qc.setQueryData<Channel[]>(
		chatKeys.channels,
		(old) => old && without(old, id),
	);
	qc.removeQueries({ queryKey: chatKeys.messages(id) });
	qc.removeQueries({ queryKey: chatKeys.ack(id) });
}

// Categories

export function upsertCategory(
	qc: QueryClient,
	category: ChannelCategory,
): void {
	qc.setQueryData<ChannelCategory[]>(
		chatKeys.categories,
		(old) => old && upsert(old, category),
	);
}

export function removeCategory(qc: QueryClient, id: string): void {
	qc.setQueryData<ChannelCategory[]>(
		chatKeys.categories,
		(old) => old && without(old, id),
	);
}

// Messages

const hasMessage = (data: MessagePages, id: string): boolean =>
	data.pages.some((page) => page.some((msg) => msg.id === id));

function mapPages(
	qc: QueryClient,
	channelId: string,
	fn: (page: Message[]) => Message[],
): void {
	qc.setQueryData<MessagePages>(
		chatKeys.messages(channelId),
		(old) => old && { ...old, pages: old.pages.map(fn) },
	);
}

export function olderCursor(page: Message[]): MessageCursor | null {
	return page.length === 0 ? null : { before: page[0].sentAt };
}

export function newerCursor(
	page: Message[],
	cursor: MessageCursor,
): MessageCursor | null {
	if (cursor === null || page.length === 0) {
		return null;
	}
	if ("after" in cursor && page.length < MESSAGES_PAGE_SIZE) {
		return null;
	}
	return { after: page[page.length - 1].sentAt };
}

function isDetached(data: MessagePages): boolean {
	return newerCursor(data.pages[0], data.pageParams[0]) !== null;
}

export function findMessage(
	qc: QueryClient,
	channelId: string,
	id: string,
): Message | undefined {
	const pages = qc.getQueryData<MessagePages>(
		chatKeys.messages(channelId),
	)?.pages;
	for (const page of pages ?? []) {
		const found = page.find((msg) => msg.id === id);
		if (found) {
			return found;
		}
	}
	return void 0;
}

export function addMessage(
	qc: QueryClient,
	channelId: string,
	message: Message,
): void {
	qc.setQueryData<MessagePages>(chatKeys.messages(channelId), (old) => {
		if (!old || hasMessage(old, message.id) || isDetached(old)) {
			return old;
		}
		const pages = [...old.pages];
		pages[0] = [...pages[0], message];
		const pageParams = [null, ...old.pageParams.slice(1)];
		return { pages, pageParams };
	});
	updateConversation(qc, { id: channelId, lastMessage: message });
}

export function addPendingMessage(
	qc: QueryClient,
	channelId: string,
	message: Message,
): void {
	const data = qc.getQueryData<MessagePages>(chatKeys.messages(channelId));
	if (data && isDetached(data)) {
		qc.setQueryData<MessagePages>(chatKeys.messages(channelId), {
			pages: [[message]],
			pageParams: [null],
		});
	}
	addMessage(qc, channelId, message);
}

export function updateMessage(
	qc: QueryClient,
	channelId: string,
	updates: Partial<Message> & Pick<Message, "id">,
): void {
	mapPages(qc, channelId, (page) =>
		page.map((msg) =>
			msg.id === updates.id ? { ...msg, ...updates } : msg,
		),
	);
}

export function removeMessage(
	qc: QueryClient,
	channelId: string,
	id: string,
): void {
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

export function setAckTime(
	qc: QueryClient,
	channelId: string,
	ackTime: Date,
): void {
	qc.setQueryData<Date | null>(chatKeys.ack(channelId), ackTime);
}
