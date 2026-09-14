import type { JSX, ReactNode } from "react";
import { toArray } from "react-emoji-render";

function isWhitespace(value: string): boolean {
	return !value.trim();
}

function isEmojiOnly(nodes: ReactNode[]): boolean {
	return nodes.every((node) =>
		typeof node === "string" ? isWhitespace(node) : true,
	);
}

/** Renders message text, enlarging it when it contains only emoji. */
function MessageContent({ content }: { content: string }): JSX.Element {
	const nodes = toArray(content) as ReactNode[];

	if (isEmojiOnly(nodes)) {
		return <span className="text-4xl">{nodes}</span>;
	}
	return <>{nodes}</>;
}

export default MessageContent;
