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
	const subpage = params.subpage ?? null;

	return (
		<div className="flex w-full h-full min-h-0 overflow-hidden">
			<ConversationSideBar
				className={subpage === null ? "flex w-full lg:w-64" : "hidden lg:flex lg:w-64"}
			/>
			<div className={`${subpage === null ? "hidden lg:flex" : "flex"} flex-1 min-w-0 h-full flex-col overflow-hidden`}>
				<MessagesSubpage subpage={subpage} />
			</div>
		</div>
	);
}
