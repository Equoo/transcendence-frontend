import { getConnection } from "@/realtime";

import type { Message } from "../api/chat.api";

export async function sendMessage(
	channelId: string,
	content: string,
	messageReference: string | undefined,
): Promise<Message> {
	const connection = getConnection();
	return connection.invoke("CreateMessage", channelId, {
		content,
		messageReference,
	});
}

export async function updateMessage(
	channelId: string,
	id: string,
	content: string,
): Promise<void> {
	const connection = getConnection();
	return connection.invoke("UpdateMessage", channelId, id, {
		content,
	});
}

export async function deleteMessage(
	channelId: string,
	id: string,
): Promise<void> {
	const connection = getConnection();
	return connection.invoke("DeleteMessage", channelId, id);
}
