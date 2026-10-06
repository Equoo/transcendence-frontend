import { create } from "zustand";

import type { Channel, ChannelCategory, Message } from "@/chat/api/chat.api";

interface ChatState {
	channels: Record<string, Channel>;
	categories: Record<string, ChannelCategory>;
	setChannels: (channels: Channel[], categories: ChannelCategory[]) => void;
	addCategory: (category: ChannelCategory) => void;
	removeCategory: (id: string) => void;
	updateCategory: (id: string, updates: ChannelCategory) => void;
	addChannel: (channel: Channel) => void;
	removeChannel: (id: string) => void;
	updateChannel: (id: string, updates: Channel) => void;
	appendMsgs: (channelId: string, messages: Message[]) => void;
	addMsg: (channelId: string, message: Message) => void;
	addMsgs: (channelId: string, messages: Message[]) => void;
	removeMsg: (channelId: string, id: string) => void;
	updateMsg: (channelId: string, id: string, updates: Message) => void;
	getMessage: (channelId: string, id: string) => Message | undefined;
}

type Data = Pick<ChatState, "channels" | "categories">;

const byId = <T extends { id: string }>(items: T[]): Record<string, T> =>
	Object.fromEntries(items.map((item) => [item.id, item]));

const withoutKey = <T>(record: Record<string, T>, key: string): Record<string, T> => {
	const { [key]: _removed, ...rest } = record;
	return rest;
};

const updateMessages = (
	state: Data,
	channelId: string,
	fn: (messages: Message[]) => Message[],
): Partial<Data> => {
	const channel = state.channels[channelId];
	// if (!channel) { return state; }
	return {
		channels: {
			...state.channels,
			[channelId]: { ...channel, messages: fn(channel.messages) },
		},
	};
};

export const useChat = create<ChatState>((set, get) => ({
	channels: {},
	categories: {},

	setChannels: (channels, categories): void => { set({ channels: byId(channels), categories: byId(categories) }); },

	// Categories
	addCategory: (category): void => { set((state) => ({ categories: { ...state.categories, [category.id]: category } })); },

	removeCategory: (id): void => {
		set((state) =>
			id in state.categories ? { categories: withoutKey(state.categories, id) } : state,
		);
	},

	updateCategory: (id, updates): void => {
		set((state) => {
			const category = state.categories[id];
			// if (!category) { return state; }
			return { categories: { ...state.categories, [id]: { ...category, ...updates } } };
		});
	},

	// Channels
	addChannel: (channel): void => { set((state) => ({ channels: { ...state.channels, [channel.id]: channel } })); },

	removeChannel: (id): void => {
		set((state) =>
			id in state.channels ? { channels: withoutKey(state.channels, id) } : state,
		);
	},

	updateChannel: (id, updates): void => {
		set((state) => {
			const channel = state.channels[id];
			// if (!channel) { return state; }
			return { channels: { ...state.channels, [id]: { ...channel, ...updates } } };
		});
	},

	// Messages
	appendMsgs: (channelId, messages): void => { set((state) => updateMessages(state, channelId, (msgs) => [...messages, ...msgs])); },

	addMsg: (channelId, message): void => { set((state) => updateMessages(state, channelId, (msgs) => [...msgs, message])); },

	addMsgs: (channelId, messages): void => { set((state) => updateMessages(state, channelId, (msgs) => [...msgs, ...messages])); },

	removeMsg: (channelId, id): void => {
		set((state) =>
			updateMessages(state, channelId, (msgs) => msgs.filter((msg) => msg.id !== id)),
		);
	},

	updateMsg: (channelId, id, updates): void => {
		set((state) =>
			updateMessages(state, channelId, (msgs) =>
				msgs.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg)),
			),
		);
	},

	getMessage: (channelId, id): Message | undefined =>
		get().channels[channelId].messages.find((msg) => msg.id === id),
}));
