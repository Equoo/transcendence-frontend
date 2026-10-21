import { useQueryClient } from "@tanstack/react-query";
import { type JSX, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useUser } from "@/users/hooks/users";
import { toastError } from "@/utils/error.util";

import {
	type ChannelBase,
	type Message,
	normalizeMessage,
	sendMessage,
	updateMessage as putMessage,
} from "../api/chat.api";
import {
	addPendingMessage,
	resolvePendingMessage,
	updateMessage,
} from "../cache/chat.cache";
import ChatComposer, { type ChatComposerHandles } from "./ChatComposer";
import { type ChatMode, ChatProvider } from "./ChatProvider";
import MessageList, { type MessageListHandles } from "./Messages/MessageList";

function ChannelChat({
	channel,
	placeholder,
}: {
	channel: ChannelBase;
	placeholder?: string;
}): JSX.Element | null {
	const qc = useQueryClient();
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const listRef = useRef<MessageListHandles>(null);
	const composerRef = useRef<ChatComposerHandles>(null);

	const [counter, setCounter] = useState(0);
	const user = useUser();

	const onSend = (
		text: string,
		mode: ChatMode,
		target: Message | null,
	): void => {
		if (mode === "edit" && target) {
			updateMessage(qc, channel.id, {
				id: target.id,
				content: text,
				editAt: new Date(),
			});
			putMessage(channel.id, target.id, text).catch((err: unknown) => {
				updateMessage(qc, channel.id, {
					id: target.id,
					content: target.content,
					editAt: target.editAt,
				});
				toastError(err as Error);
			});

			return;
		}

		const pendingId = `${new Date().getTime().toString()}_${counter}`;
		const message = {
			id: pendingId,
			content: text,
			channel: { id: channel.id },
			sentAt: new Date(),
			sender: user,
			messageRef: target,
			status: "pending",
		} as Message;

		setCounter(counter + 1);
		addPendingMessage(qc, channel.id, message);

		sendMessage(channel.id, text, target?.id)
			.then((msg) => {
				resolvePendingMessage(qc, channel.id, {
					pendingId,
					message: { ...normalizeMessage(msg), status: "sended" },
				});
			})
			.catch((err: unknown) => {
				updateMessage(qc, channel.id, {
					id: pendingId,
					status: "error",
				});
				toastError(err as Error);
			});

		listRef.current?.scrollBack();
	};

	return (
		<div className="flex min-h-0 flex-1">
			<div className="flex min-w-0 flex-1 flex-col">
				<ChatProvider
					chatId={channel.id}
					listRef={listRef}
					composerRef={composerRef}
				>
					<MessageList
						ref={listRef}
						key={channel.id}
						channelId={channel.id}
						channelName={channel.name}
						channelType={channel.type}
					/>
					<ChatComposer
						ref={composerRef}
						placeholder={
							placeholder ??
							t("chat.messageTo", {
								name: channel.name,
							})
						}
						onSend={onSend}
					/>
				</ChatProvider>
			</div>
		</div>
	);
}

export default ChannelChat;
