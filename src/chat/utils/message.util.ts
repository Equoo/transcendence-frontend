import { isSameDay, isSameMinute } from "date-fns";
import i18n from "i18next";

import type { Message } from "../api/chat.api";

const EPOCH = new Date("1970-01-01T00:00:00");

export function startsNewDay(message: Message, previous?: Message): boolean {
	return !isSameDay(message.sentAt, previous?.sentAt ?? EPOCH);
}

export function startsNewGroup(message: Message, previous?: Message): boolean {
	return (
		previous?.sender.id !== message.sender.id ||
		!isSameMinute(message.sentAt, previous.sentAt)
	);
}

export interface MessageImage {
	name: string;
	src: string;
}

const IMAGE_LINE =
	/^!\[(?<name>[^\]\n]*)\]\((?<src>\/api\/files\/[\w-]+|blob:[^)\s]+)\)$/u;

export const IMAGE_LINE_LENGTH = 96;
const IMAGE_NAME_LENGTH = 32;

export function formatImage({ name, src }: MessageImage): string {
	return `![${name.replace(/[\]\n]/gu, "").slice(0, IMAGE_NAME_LENGTH)}](${src})`;
}

export function parseMessageContent(content: string): {
	text: string;
	images: MessageImage[];
} {
	const images: MessageImage[] = [];
	const lines = content.split("\n").filter((line) => {
		const match = IMAGE_LINE.exec(line.trim());
		if (match) {
			images.push({
				name: match.groups?.name ?? "",
				src: match.groups?.src ?? "",
			});
		}
		return !match;
	});
	return { text: lines.join("\n").trim(), images };
}

export function previewMessageContent(content: string): string {
	const { text, images } = parseMessageContent(content);
	return [text, ...images.map(() => `📷 ${i18n.t("chat.image")}`)]
		.filter((part) => part !== "")
		.join(" ");
}
