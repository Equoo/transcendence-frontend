import type { ProblemDetail } from "./problem_detail";
import type { User } from "./users";
import { useState } from 'react';
import { create } from 'zustand';

export const useChannels = create((set) => ({
  channels: [],

  addChannel: (item) =>
    set((state) => ({ channels: [...state.channels, item] })),

  removeChannel: (id) =>
    set((state) => ({ channels: state.channels.filter((i) => i.id !== id) })),

  updateChannel: (id, updates) =>
    set((state) => ({
      channels: state.channels.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),

  clearChannels: () => set({ channels: [] }),

  setChannels: (newchannels) => set({ channels: newchannels }),
}));

export interface Channel {
	id: string;
	name: string;
	topic: string;
	createAt: string;
	eventId?: string;
	category?: string;
}

export interface ReqNewChannel {
	name: string;
	topic: string;
	eventId?: string;
}
function toReqNewChannel(formData: FormData): ReqNewChannel  {
	return {
		name: formData.get("name") as string,
		topic: formData.get("topic") as string
	};
}

export interface Message {
	id: string;
	content: string;
	sentAt: string;
	messageReference?: string;
	sender: User;
	channel: Channel;
}

export type MessageActionResult =
	| { ok: true; message: Message }
	| { ok: false; error: ProblemDetail };

export type ChannelActionResult =
	| { ok: true; channel: Channel }
	| { ok: false; error: ProblemDetail };

export async function fetchChannels(): Promise<Channel[]> {
	const response = await fetch("/api/channels");
	if (!response.ok) {
		throw new Error("Can't fetch channels");
	}

	const channels = (await response.json()) as Channel[];
	return channels;
}

export async function fetchMessages(channelId: string, limit: number, before: string): Promise<Message[]> {
	const response = await fetch(`/api/channels/${channelId}/messages`);
	if (!response.ok) {
		return { ok: false, error: (await response.json()) as ProblemDetail };
	}
	return {
		ok: true,
		messages: (await response.json()) as Message[],
	};
}

export async function createChannel(
	formData: FormData,
): Promise<ChannelActionResult> {
	const object = toReqNewChannel(formData);

	const response = await fetch("/api/channels", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(object),
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
