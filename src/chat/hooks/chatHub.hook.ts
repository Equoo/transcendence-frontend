import {
	type HubConnection,
	HubConnectionBuilder,
	LogLevel,
} from "@microsoft/signalr";
import { create } from "zustand";

import { type ActivityEnum, useActivity } from "@/activity/hooks/activity.hook";

import { type Channel, type ChannelCategory, type Message, normalizeMessage } from "../api/chat.api";
import { useChat } from "./chat.hook";

interface ChatHub {
	hub: HubConnection | null;
	pending: boolean;
	connect: () => Promise<void>;
}

export const useChatHub = create<ChatHub>((set) => ({
	hub: null,
	pending: false,

	connect: async (): Promise<void> => {
		try {
			if (useChatHub.getState().hub || useChatHub.getState().pending) {
				return;
			}
			set({ hub: null, pending: true });

			const conn = new HubConnectionBuilder()
				.withUrl("/api/")
				.configureLogging(LogLevel.Information)
				.build();

			conn.on("NewMessage", (channelId: string, msg: Message) => {
				useChat.getState().addMsg(channelId, normalizeMessage(msg));
			});

			conn.on("RemoveMessage", (channelId: string, id: string) => {
				useChat.getState().removeMsg(channelId, id);
			});

			conn.on(
				"UpdateMessage",
				(channelId: string, id: string, msg: Message) => {
					useChat
						.getState()
						.updateMsg(channelId, id, normalizeMessage(msg));
				},
			);

			conn.on("NewChannel", (channel: Channel) => {
				useChat.getState().addChannel(channel);
			});

			conn.on("UpdateChannel", (channel: Channel) => {
				useChat.getState().updateChannel(channel.id, channel);
			});

			conn.on("RemoveChannel", (channel: string) => {
				useChat.getState().removeChannel(channel);
			});

			conn.on("NewCategory", (category: ChannelCategory) => {
				useChat.getState().addCategory(category);
			});

			conn.on("UpdateCategory", (category: ChannelCategory) => {
				useChat.getState().updateCategory(category.id, category);
			});

			conn.on("RemoveCategory", (category: string) => {
				useChat.getState().removeCategory(category);
			});

			conn.on(
				"OtherActivityUpdated",
				(userId: string, activity: ActivityEnum) => {
					useActivity.getState().setOtherActivity(userId, activity);
				},
			);

			conn.on("ReportActivityTo", (userId: string) => {
				useActivity.getState().reportActivityTo(userId);
			});

			conn.onclose(() => {
				console.warn("Connection closed");
			});

			await conn
				.start()
				.then(() => {
					set({ hub: conn, pending: false });
				})
				.catch((err: unknown) => {
					console.error("Error while starting connection: ", err);
					set({ hub: null, pending: true });
				});
		} catch (error) {
			console.error("Connection error: ", error);
			set({ hub: null, pending: true });
		}
	},
}));
