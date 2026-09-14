import {
	type HubConnection,
	HubConnectionBuilder,
	LogLevel,
} from "@microsoft/signalr";
import { create } from "zustand";

import { type Channel, type Message, normalizeMessage } from "../api/chat.api";
import { useChat } from "./chat.hook";
interface ChatHub {
	hub: HubConnection | null;
	pending: boolean;
	connect: () => void;
}

export const useChatHub = create<ChatHub>((set) => ({
	hub: null,
	pending: false,

	connect: (): void => {
		try {
			if (useChatHub.getState().hub || useChatHub.getState().pending) {
				return;
			}
			set({ hub: null, pending: true });

			const conn = new HubConnectionBuilder()
				.withUrl("/api/chat")
				.configureLogging(LogLevel.Information)
				.build();

			conn.on("NewMessage", (channelId: string, msg: Message) => {
				useChat.getState().addMsg(channelId, normalizeMessage(msg));
			});

			conn.on("RemoveMessage", (channelId: string, id: string) => {
				useChat.getState().removeMsg(channelId, id);
			});

			conn.on("UpdateMessage", (channelId: string, id: string, msg: Message) => {
				useChat.getState().updateMsg(channelId, id, normalizeMessage(msg));
			});

			conn.on("NewChannel", (channel: Channel) => {
				useChat.getState().addChannel(channel);
			});

			conn.onclose(() => {
				console.warn("Connection closed");
			});

			conn.start()
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
