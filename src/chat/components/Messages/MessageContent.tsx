import type { JSX, ReactNode } from "react";
import { toArray } from "react-emoji-render";

import { parseMessageContent } from "../../utils/message.util";
import MessageImages from "./MessageImages";

function isWhitespace(value: string): boolean {
	return !value.trim();
}

function isEmojiOnly(nodes: ReactNode[]): boolean {
	return nodes.every((node) =>
		typeof node === "string" ? isWhitespace(node) : true,
	);
}

function MessageText({ content }: { content: string }): JSX.Element {
	const nodes = toArray(content) as ReactNode[];

	if (isEmojiOnly(nodes)) {
		return <span className="text-4xl">{nodes}</span>;
	}
	return <>{nodes}</>;
}

function MessageContent({ content }: { content: string }): JSX.Element {
	const { text, images } = parseMessageContent(content);

	return (
		<>
			{text !== "" && <MessageText content={text} />}
			{images.length > 0 && <MessageImages images={images} />}
		</>
	);
}

export default MessageContent;
