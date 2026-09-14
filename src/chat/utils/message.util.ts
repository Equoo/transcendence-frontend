import { isSameDay, isSameMinute } from "date-fns";

import type { Message } from "../api/chat.api";

const EPOCH = new Date("1970-01-01T00:00:00");

/** Whether a day separator should be rendered before `message`. */
export function startsNewDay(message: Message, previous?: Message): boolean {
	return !isSameDay(message.sentAt, previous?.sentAt ?? EPOCH);
}

/**
 * Whether `message` opens a new visual group (avatar + header shown).
 * Consecutive messages from the same sender within the same minute are
 * grouped together and share a single header.
 */
export function startsNewGroup(message: Message, previous?: Message): boolean {
	return (
		previous?.sender.id !== message.sender.id ||
		!isSameMinute(message.sentAt, previous.sentAt)
	);
}
