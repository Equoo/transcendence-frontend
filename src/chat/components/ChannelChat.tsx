import { useQueryClient } from "@tanstack/react-query";
import { type JSX, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { uploadChatImage } from "@/files/api/files.api";
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
import {
	formatImage,
	type MessageImage,
	parseMessageContent,
} from "../utils/message.util";
import ChatComposer, {
	type ChatComposerHandles,
	type ChatDraft,
} from "./ChatComposer";
import { type ChatMode, ChatProvider } from "./ChatProvider";
import MessageList, { type MessageListHandles } from "./Messages/MessageList";

function withImages(text: string, images: MessageImage[]): string {
	return [text, ...images.map(formatImage)]
		.filter((line) => line !== "")
		.join("\n");
}

async function uploadImages(
	channelId: string,
	images: File[],
): Promise<MessageImage[]> {
	const files = await Promise.all(
		images.map(async (image) => uploadChatImage(channelId, image)),
	);
	return files.map((file, idx) => ({
		name: images[idx].name,
		src: `/api/files/${file.key}`,
	}));
}

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
		{ text, images }: ChatDraft,
		mode: ChatMode,
		target: Message | null,
	): void => {
		if (mode === "edit" && target) {
			// Only the text is editable, attached images are kept as is
			const content = withImages(
				text,
				parseMessageContent(target.content).images,
			);
			updateMessage(qc, channel.id, {
				id: target.id,
				content,
				editAt: new Date(),
			});
			putMessage(channel.id, target.id, content).catch((err: unknown) => {
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
		const localImages = images.map((image) => ({
			name: image.name,
			src: URL.createObjectURL(image),
		}));
		const message = {
			id: pendingId,
			content: withImages(text, localImages),
			channel: { id: channel.id },
			sentAt: new Date(),
			sender: user,
			messageRef: target,
			status: "pending",
		} as Message;

		setCounter(counter + 1);
		addPendingMessage(qc, channel.id, message);

		uploadImages(channel.id, images)
			.then(async (uploaded) =>
				sendMessage(channel.id, withImages(text, uploaded), target?.id),
			)
			.then((msg) => {
				resolvePendingMessage(qc, channel.id, {
					pendingId,
					message: { ...normalizeMessage(msg), status: "sended" },
				});
				for (const { src } of localImages) {
					URL.revokeObjectURL(src);
				}
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
		<div className="flex min-h-0 min-w-0 flex-1">
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
