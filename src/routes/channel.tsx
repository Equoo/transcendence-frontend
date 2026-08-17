import { type JSX, useEffect, useState } from "react";
import { PiPushPin, PiUsers } from "react-icons/pi";
import { useShallow } from "zustand/react/shallow";

import { fetchMessages } from "@/chat/api/chat.api";
import MessageComposer from "@/chat/components/MessageComposer";
import MessageList from "@/chat/components/MessageList";
import { useChat } from "@/chat/hooks/chat.hook";
import IconBtn from "@/components/IconBtn";

import type { Route } from "./+types/channel";

export default function ChannelRoute({
	params,
}: Route.ComponentProps): JSX.Element {
	const channel = useChat((state) => state.channels[params.channelId]);
	const messages = useChat(
		useShallow((state) => state.channels[params.channelId]?.messages ?? []),
	);

	const [isFree, setIsFree] = useState(true);
	useEffect(() => {
		async function loadMessages(): Promise<void> {
			if (!isFree) {
				return;
			}
			try {
				setIsFree(false);
				useChat
					.getState()
					.addMsgs(
						params.channelId,
						await fetchMessages(params.channelId, 10, null),
					);
			} catch (err) {
				console.error(err);
			} finally {
				setIsFree(true);
			}
		}

		if (messages.length === 0) {
			void loadMessages();
		}
	}, [isFree, messages.length, params.channelId]);

	return (
		<div className="flex flex-col w-full h-full">
			<div className="flex flex-none items-center gap-3 border-b border-border px-5.5 py-3.75">
				<div className="flex flex-col">
					<div className="flex items-center gap-1.75 font-head text-[17px] font-[650]">
						<span className="text-muted">#</span>
						{channel?.name}
					</div>
					<div className="text-[12.5px] text-muted">
						{channel?.topic}
					</div>
				</div>
				<span className="flex-1" />
				{/* <AvatarGroup people={online} size={30} max={4} /> */}
				<IconBtn discrete icon={PiPushPin} />
				<IconBtn discrete icon={PiUsers} />
			</div>

			<div className="flex min-h-0 flex-1">
				<div className="flex min-w-0 flex-1 flex-col">
					<MessageList
						msgs={messages}
						channelId={channel?.id ?? ""}
					/>
					<MessageComposer
						placeholder={`Message to #${channel?.name}...`}
						channelId={channel?.id ?? ""}
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
		</div>
	);
}
