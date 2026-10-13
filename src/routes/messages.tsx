import type { JSX } from "react";

import ChannelChat from "@/chat/components/ChannelChat";
import { ConversationSideBar } from "@/friends/components/SideBar";
import { useConversation } from "@/friends/hooks/useConversations";

import type { Route } from "./+types/messages";

function Chat({ chatId }: { chatId: string }): JSX.Element {
	const { data, isPending, error } = useConversation(chatId);

	if (isPending) { return <div>LOADING</div>; }
	if (error) { return <div>ERROR</div>; }

	return (
		<div className="relative flex flex-col w-full h-full">
			<div className="flex flex-none items-center gap-3 border-b border-border px-5.5 py-3.75">
				<div className="flex flex-col">
					<div className="flex items-center gap-1.75 font-head text-[17px] font-[650]">
						<span className="text-muted">#</span>
						{data.name}
					</div>
					<div className="text-[12.5px] text-muted">
						{data.topic}
					</div>
				</div>
				<span className="flex-1" />
			</div>

			<ChannelChat channel={data}></ChannelChat>
		</div>
	);
}

function FriendsSubpage({ subpage }: { subpage: string | null }): JSX.Element {
	switch (subpage) {
		case null:
			return <div>HOME</div>;
		case "all":
			return <div>ALL</div>;
		case "online":
			return <div>ONLINE</div>;
		case "pending":
			return <div>PENDING</div>;
		default: {
			return <Chat chatId={subpage}></Chat>;
		}
	}
}

export default function Messages({
	params,
}: Route.ComponentProps): JSX.Element {
	return (<>
		<ConversationSideBar />
		<div className="h-full sm:pl-64 flex flex-col w-full items-center overflow-hidden">
			<FriendsSubpage subpage={params.subpage ?? null} />
		</div>
	</>);
}
