import type { ProblemDetail } from "./problem_detail";
import type { User } from "./users";
import { useState } from 'react';
import { create } from 'zustand';

export interface Message {
	id: string;
	content: string;
	sentAt: Date;
	editAt?: Date;
	messageReference?: string;
	sender: User;
	channel: {channelId: string};
}

export interface Channel {
	id: string;
	name: string;
	topic: string;
	createAt: Date;
	eventId?: string;
	category?: string;
	messages?: Message[];
}

interface ChatState {
	channels: Record<string, Channel>;
	setChannel: (channels: Channel[]) => void;
	addChannel: (channel: Channel) => void;
	removeChannel: (id: string) => void;
	updateChannel: (id: string, updates: any) => void;
	setMsg: (channelId: string, messages: Message[]) => void;
	appendMsgs: (channelId: string, messages: Message[]) => void;
	addMsg: (channelId: string, message: Message) => void;
	addMsgs: (channelId: string, messages: Message[]) => void;
	removeMsg: (channelId: string, id: string) => void;
	updateMsg: (channelId: string, id: string, updates: any) => void;
}

export const useChat = create<ChatState>((set) => ({
	channels: {},

	setChannels: (channels) => set({ channels: Object.fromEntries(channels.map((c) => [c.id, c])) }),

	addChannel: (channel) =>
		set((state) => ({
			channels: { ...state.channels, [channel.id]: channel },
		})),
  
	removeChannel: (id) =>
		set((state) => ({ channels: {
				...state.channels,
				[id]: null
			}
		})),

	updateChannel: (id, updates) =>
		set((state) => ({
			channels: {
				...state.channels,
				[id]: {
					...state.channels[id],
					...updates
				}
			}
		})),
	
	setMsgs: (channelId, messages) => set({ channels: {
			...state.channels,
			[channelId]: {
				...state.channels[channelId],
				messages: messages
			}
		}
	}),

	appendMsgs: (channelId, messages) =>
		set((state) => ({
			channels: {
				...state.channels,
				[channelId]: {
					...state.channels[channelId],
					messages: [...messages, ...state.channels[channelId].messages ?? []],
				},
			},
		})),
	
	addMsg: (channelId, message) =>
		set((state) => ({
			channels: {
				...state.channels,
				[channelId]: {
					...state.channels[channelId],
					messages: [...state.channels[channelId].messages ?? [], message],
				},
			},
		})),
	
	addMsgs: (channelId, messages) =>
		set((state) => ({
			channels: {
				...state.channels,
				[channelId]: {
					...state.channels[channelId],
					messages: [...state.channels[channelId].messages ?? [], ...messages],
				},
			},
		})),
	
	removeMsg: (channelId, id) =>
		set((state) => ({ channels: {
				...state.channels,
				[channelId]: {
					...state.channels[channelId],
					messages: state.channels[channelId].messages.filter(m => m.id != id)
				}
			}
		})),

	updateMsg: (channelId, id, updates) =>
		set((state) => ({
			channels: {
				...state.channels,
				[channelId]: {
					...state.channels[channelId],
					messages: state.channels[channelId].messages.map((i) => (i.id === id ? { ...i, ...updates } : i))
				}
			}
		})),
}));


export async function fetchChannels(): Promise<Channel[]> {
	const response = await fetch("/api/channels");
	if (!response.ok) {
		throw new Error("Can't fetch channels");
	}

	const channels = (await response.json()) as Channel[];
	return channels;
}

export async function fetchMessages(channelId: string, limit: number, before: string | null): Promise<Message[]> {
	let url = `/api/channels/${channelId}/messages?take=${limit}`;
	
	if (before) {
		url += `&before=${before.toISOString()}`;
	}

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error("Can't fetch messages");
	}
	const raw = (await response.json()) as Message[];
	const messages: Message[] = raw.map(m => ({
		...m,
		sentAt: new Date(m.sentAt),
		editAt: m.editAt ? new Date(m.editAt) : undefined,
	}));
	return messages;
}


export type ActionResult =
	| { ok: true; data: Any }
	| { ok: false; error: ProblemDetail };

export type ChannelActionResult =
	| { ok: true; channel: Channel }
	| { ok: false; error: ProblemDetail };

export async function createChannel(
	formData: FormData,
): Promise<ChannelActionResult> {
	const response = await fetch("/api/channels", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name: formData.get("name") as string,
			topic: formData.get("topic") as string
		}),
	});

	if (!response.ok) {
		return {
			ok: false,
			error: (await response.json()) as ProblemDetail,
		};
	}

	return {
		ok: true,
		channel: (await response.json()) as Channel,
	};
}


export async function sendMessage(
	channelId: string,
	content: string
): Promise<ActionResult> {
	const response = await fetch(`/api/channels/${channelId}/messages`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			content: content
		}),
	});

	if (!response.ok) {
		return {
			ok: false,
			error: (await response.json()) as ProblemDetail,
		};
	}

	return {
		ok: true,
		data: (await response.json()) as Message,
	};
}
