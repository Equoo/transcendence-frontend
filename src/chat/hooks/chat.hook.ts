import { create } from "zustand";

import type { Channel, Message } from "@/chat/api/chat.api";

interface ChatState {
	channels: Record<string, Channel | null>;
	setChannels: (channels: Channel[]) => void;
	addChannel: (channel: Channel) => void;
	removeChannel: (id: string) => void;
	updateChannel: (id: string, updates: Channel) => void;
	appendMsgs: (channelId: string, messages: Message[]) => void;
	addMsg: (channelId: string, message: Message) => void;
	addMsgs: (channelId: string, messages: Message[]) => void;
	removeMsg: (channelId: string, id: string) => void;
	updateMsg: (channelId: string, id: string, updates: Channel) => void;
}

export const useChat = create<ChatState>((set) => ({
	channels: {},

	setChannels: (channels): void => {
		set({
			channels: Object.fromEntries(channels.map((ch) => [ch.id, ch])),
		});
	},

	addChannel: (channel): void => {
		set((state) => ({
			channels: { ...state.channels, [channel.id]: channel },
		}));
	},

	removeChannel: (id): void => {
		set((state) => ({
			channels: {
				...state.channels,
				[id]: null,
			},
		}));
	},

	updateChannel: (id, updates): void => {
		set((state) => ({
			channels: {
				...state.channels,
				[id]: {
					...state.channels[id],
					...updates,
				},
			},
		}));
	},

	appendMsgs: (channelId, messages): void => {
		set((state) => ({
			channels: {
				...state.channels,
				[channelId]: {
					...state.channels[channelId],
					...({
						messages: [
							...messages,
							...(state.channels[channelId]?.messages ?? []),
						] as Message[],
					} as Channel),
				},
			},
		}));
	},

	addMsg: (channelId, message): void => {
		set((state) => ({
			channels: {
				...state.channels,
				[channelId]: {
					...state.channels[channelId],
					...({
						messages: [
							...(state.channels[channelId]?.messages ?? []),
							message,
						] as Message[],
					} as Channel),
				},
			},
		}));
	},

	addMsgs: (channelId, messages): void => {
		set((state) => ({
			channels: {
				...state.channels,
				[channelId]: {
					...state.channels[channelId],
					...({
						messages: [
							...(state.channels[channelId]?.messages ?? []),
							...messages,
						] as Message[],
					} as Channel),
				},
			},
		}));
	},

	removeMsg: (channelId, id): void => {
		set((state) => ({
			channels: {
				...state.channels,
				[channelId]: {
					...state.channels[channelId],
					...({
						messages: state.channels[channelId]?.messages.filter(
							(msg) => msg.id !== id,
						),
					} as Channel),
				},
			},
		}));
	},

	updateMsg: (channelId, id, updates): void => {
		set((state) => ({
			channels: {
				...state.channels,
				[channelId]: {
					...state.channels[channelId],
					...({
						messages: state.channels[channelId]?.messages.map(
							(msg) =>
								msg.id === id ? { ...msg, ...updates } : msg,
						),
					} as Channel),
				},
			},
		}));
	},
}));
