import type { JSX } from "react";

import ConversationChat from "@/friends/components/ConversationChat";
import FriendsPage, { type FriendsFilter } from "@/friends/components/FriendsPage";
import { ConversationSideBar } from "@/friends/components/SideBar";

import type { Route } from "./+types/messages";

const FILTERS: string[] = ["all", "online", "pending", "blocked"] satisfies FriendsFilter[];

function MessagesSubpage({ subpage }: { subpage: string | null }): JSX.Element {
	if (subpage === null) {
		return <FriendsPage filter={null} />;
	}
	if (FILTERS.includes(subpage)) {
		return <FriendsPage filter={subpage as FriendsFilter} />;
	}
	return <ConversationChat chatId={subpage} />;
}

export default function Messages({
	params,
}: Route.ComponentProps): JSX.Element {
	return (<>
		<ConversationSideBar />
		<div className="h-full sm:pl-64 flex flex-col w-full items-center overflow-hidden">
			<MessagesSubpage subpage={params.subpage ?? null} />
		</div>
	</>);
}
