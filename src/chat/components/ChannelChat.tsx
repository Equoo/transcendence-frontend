import {
	type JSX,
	useRef,
	useState,
} from "react";

import { useChat } from "@/chat/hooks/chat.hook";
import { useUser } from "@/users/hooks/users.hooks";

import { type Message, sendMessage, updateMessage } from "../api/chat.api";
import ChatComposer, { type ChatComposerHandles } from "./ChatComposer";
import { ChatProvider } from "./ChatProvider";
import MessageList, { type MessageListHandles } from "./MessageList";

function ChannelChat({ channelId }: { channelId: string }): JSX.Element {
	const channel = useChat((state) => state.channels[channelId]);
	const listRef = useRef<MessageListHandles>(null);
	const composerRef = useRef<ChatComposerHandles>(null);

	const [counter, setCounter] = useState(0);
	const user = useUser();

	const addMsg = useChat((state) => state.addMsg);
	const updateMsg = useChat((state) => state.updateMsg);

	const onSend = (text: string, mode: "default" | "edit" | "reply", target: Message | null): void => {
		if (mode === "edit" && target) {
			target.content = text;
			updateMsg(channelId, target.id, target);
			updateMessage(channelId, target.id, text).catch(() => {
				// eslint-disable-next-line no-warning-comments
				// TODO: error
			});

			return;
		}

		const pendingId = new Date().toString() + counter;
		let message = {
			id: pendingId,
			content: text,
			channel: { id: channelId },
			sentAt: new Date(),
			sender: user,
			messageReference: target?.id,
			status: "pending",
		} as Message;

		setCounter(counter + 1);
		addMsg(channelId, message);

		sendMessage(channelId, text, target?.id)
			.then((msg) => {
				message = {
					...msg,
					sentAt: new Date(msg.sentAt),
					editAt: msg.editAt && new Date(msg.editAt),
					status: "sended",
				};
				updateMsg(channelId, pendingId, message);
			})
			.catch(() => {
				message.status = "error";
				updateMsg(channelId, pendingId, message);
			});

		listRef.current?.scrollBack();
	};

	return (
		<div className="flex min-h-0 flex-1">
			<div className="flex min-w-0 flex-1 flex-col">
				<ChatProvider chatId={channel?.id ?? ""} listRef={listRef} composerRef={composerRef}>
					<MessageList
						ref={listRef}
						key={channel?.id}
						channelId={channel?.id ?? ""}
					/>
					<ChatComposer
						ref={composerRef}
						placeholder={`Message to #${channel?.name}...`}
						onSend={onSend}
					/>
				</ChatProvider>
			</div>
		</div>
	);
}

export default ChannelChat;
