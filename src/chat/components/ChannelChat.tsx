import { useQueryClient } from "@tanstack/react-query";
import { type JSX, useRef, useState } from "react";

import { useUser } from "@/users/hooks/users";

import { type Message, normalizeMessage, sendMessage, updateMessage as putMessage } from "../api/chat.api";
import { addMessage, resolvePendingMessage, updateMessage } from "../cache/chat.cache";
import { useChannel } from "../hooks/useChannels";
import ChatComposer, { type ChatComposerHandles } from "./ChatComposer";
import { ChatProvider } from "./ChatProvider";
import MessageList, { type MessageListHandles } from "./Messages/MessageList";

function ChannelChat({ channelId }: { channelId: string }): JSX.Element | null {
	const { data: channel } = useChannel(channelId);
	const qc = useQueryClient();
	const listRef = useRef<MessageListHandles>(null);
	const composerRef = useRef<ChatComposerHandles>(null);

	const [counter, setCounter] = useState(0);
	const user = useUser();

	const onSend = (
		text: string,
		mode: "default" | "edit" | "reply",
		target: Message | null,
	): void => {
		if (mode === "edit" && target) {
			updateMessage(qc, channelId, { id: target.id, content: text, editAt: new Date() });
			putMessage(channelId, target.id, text).catch(() => {
				// eslint-disable-next-line no-warning-comments
				// TODO: error
			});

			return;
		}

		const pendingId = new Date().toString() + counter;
		const message = {
			id: pendingId,
			content: text,
			channel: { id: channelId },
			sentAt: new Date(),
			sender: user,
			messageRef: target,
			status: "pending",
		} as Message;

		setCounter(counter + 1);
		addMessage(qc, channelId, message);

		sendMessage(channelId, text, target?.id)
			.then((msg) => {
				resolvePendingMessage(qc, channelId, {
					pendingId,
					message: { ...normalizeMessage(msg), status: "sended" },
				});
			})
			.catch(() => {
				updateMessage(qc, channelId, { id: pendingId, status: "error" });
			});

		listRef.current?.scrollBack();
	};

	if (!channel) { return null; }

	return (
		<div className="flex min-h-0 flex-1">
			<div className="flex min-w-0 flex-1 flex-col">
				<ChatProvider chatId={channel.id} listRef={listRef} composerRef={composerRef}>
					<MessageList
						ref={listRef}
						key={channel.id}
						channelId={channel.id}
						channelName={channel.name}
					/>
					<ChatComposer
						ref={composerRef}
						placeholder={`Message to #${channel.name}...`}
						onSend={onSend}
					/>
				</ChatProvider>
			</div>
		</div>
	);
}

export default ChannelChat;
