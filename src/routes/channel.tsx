import type { JSX } from "react";
import type { Route } from "./+types/channel";
import { useChannels, fetchMessages, type Message, type Channel } from "../models/chat";
import { PiPushPin, PiUsers } from "react-icons/pi";
import { redirect, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Alert from "../components/Alert";
import ProfilePic from "../components/ProfilePic";
import IconBtn from "../components/IconBtn";
import MessageComposer from "../components/Chat/MessageComposer";
import MessageList from "../components/Chat/MessageList";

export async function clientLoader({
	params,
}: Route.ClientLoaderArgs): Promise<{messages: Message[], channelId: string} | Response> {
	const res = await fetchMessages(params.channelId, 10, "");

	if (!res.ok) {
		toast.error(Alert, { data: { ...res.error } });
		return redirect("/");
	}
	return { messages: res.messages, channelId: params.channelId };
}

export default function Channel({
	loaderData: data,
}: Route.ComponentProps): JSX.Element {
	const channel = useChannels((state) => state.channels).find(c => c.id == data.channelId);
	const messages = data.messages;

	return (
		<div className="flex flex-col w-full h-full">
			<div className="flex flex-none items-center gap-3 border-b border-border px-[22px] py-[15px]">
				<div className="flex flex-col">
					<div className="flex items-center gap-[7px] font-head text-[17px] font-[650]">
						<span className="text-muted">#</span>
						{channel.name}
					</div>
					<div className="text-[12.5px] text-muted">
						{channel.topic}
					</div>
				</div>
				<span className="flex-1" />
				{/* <AvatarGroup people={online} size={30} max={4} /> */}
				<IconBtn discrete icon={PiPushPin} />
				<IconBtn discrete icon={PiUsers} />
			</div>

			<div className="flex min-h-0 flex-1">
				<div className="flex min-w-0 flex-1 flex-col">
					<MessageList msgs={messages} />
					<MessageComposer placeholder={`Message to #${channel.name}...`} />
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
