import { type JSX, useRef, useState } from "react";

import { useChat } from "@/chat/hooks/chat.hook";
import { useUser } from "@/users/hooks/users.hooks";

import { type Message, sendMessage } from "../api/chat.api";
import ChatComposer from "./ChatComposer";
import MessageList, { type MessageListHandles } from "./MessageList";

function ChannelChat({ channelId }: { channelId: string }): JSX.Element {
	const channel = useChat((state) => state.channels[channelId]);
	const listRef = useRef<MessageListHandles>(null);

	const addMsg = useChat((state) => state.addMsg);
	const updateMsg = useChat((state) => state.updateMsg);

	const [counter, setCounter] = useState(0);
	const user = useUser();

	const onSend = (text: string): void => {
		const pendingId = new Date().toString() + counter;
		let message = {
			id: pendingId,
			content: text,
			channel: { id: channelId },
			sentAt: new Date(),
			sender: user,
			status: "pending",
		} as Message;

		setCounter(counter + 1);
		addMsg(channelId, message);

		sendMessage(channelId, text)
			.then((msg) => {
				message = {
					...msg,
					sentAt: new Date(msg.sentAt),
					editAt: msg.editAt ? new Date(msg.editAt) : null,
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
				<MessageList
					ref={listRef}
					key={channel?.id}
					channelId={channel?.id ?? ""}
				/>
				<ChatComposer
					placeholder={`Message to #${channel?.name}...`}
					onSend={onSend}
				/>
			</div>

			{/* {thread && ( */}
			{/* 	<div className="kg-fade flex flex-none w-[280px] flex-col overflow-hidden border-l border-border bg-surface"> */}
			{/* 		<div className="flex items-center justify-between border-b border-border px-[18px] py-[14px] font-head font-[650]"> */}
			{/* 			Fil de discussion */}
			{/* 			<IconBtn name="x" size={18} onClick={() => setThread(false)} /> */}
			{/* 		</div> */}
			{/* 		<div className="flex flex-col gap-[18px] overflow-y-auto px-[18px] py-4"> */}
			{/* 			<ChatMessagesPlain msgs={KG.threadMsgs} /> */}
			{/* 		</div> */}
			{/* 		<Composer placeholder="Répondre au fil…" /> */}
			{/* 	</div> */}
			{/* )} */}
		</div>
	);
}

export default ChannelChat;
