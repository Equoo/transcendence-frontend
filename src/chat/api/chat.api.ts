import { APIError, type ProblemDetail } from "@/api/problem_detail";
import { useChat } from "@/chat/hooks/chat.hook";
import type { User } from "@/users/api/users.api";

export interface Message {
	id: string;
	content: string;
	sentAt: Date;
	editAt?: Date | null;
	messageReference?: string;
	sender: User;
	channel: Channel;
	status: string;
}

export function normalizeMessage(msg: Message): Message {
	return {
		...msg,
		...({
			sentAt: new Date(msg.sentAt),
			editAt:
				typeof msg.editAt !== "undefined" &&
				new Date(msg.editAt ?? new Date()),
		} as Message),
	};
}

export interface Channel {
	id: string;
	name: string;
	topic: string;
	createAt: Date;
	eventId?: string;
	category?: string;
	messages: Message[];
}

export async function fetchChannels(): Promise<Channel[] | null> {
	if (Object.keys(useChat.getState().channels).length !== 0) {
		return null;
	}

	const response = await fetch("/api/channels");
	if (!response.ok) {
		throw new APIError((await response.json()) as ProblemDetail);
	}

	const channels = (await response.json()) as Channel[];
	useChat.getState().setChannels(channels);

	return channels;
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

	const response = await fetch(url);
	if (!response.ok) {
		throw new APIError((await response.json()) as ProblemDetail);
	}

	const raw = (await response.json()) as Message[];
	const messages: Message[] = raw.map((msg) => normalizeMessage(msg));
	return messages;
}

export async function createChannel(formData: FormData): Promise<Channel> {
	const response = await fetch("/api/channels", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name: formData.get("name") as string,
			topic: formData.get("topic") as string,
		}),
	});

	if (!response.ok) {
		throw new APIError((await response.json()) as ProblemDetail);
	}

	return (await response.json()) as Channel;
}

export async function sendMessage(
	channelId: string,
	content: string,
): Promise<Message> {
	const response = await fetch(`/api/channels/${channelId}/messages`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			content,
		}),
	});

	if (!response.ok) {
		throw new APIError((await response.json()) as ProblemDetail);
	}

	return (await response.json()) as Message;
}

export async function updateMessage(
	channelId: string,
	id: string,
	content: string,
): Promise<Message> {
	const response = await fetch(`/api/channels/${channelId}/messages/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			content,
		}),
	});

	if (!response.ok) {
		throw new APIError((await response.json()) as ProblemDetail);
	}

	return (await response.json()) as Message;
}
