import type { JSX } from "react/jsx-runtime";
import { NavLink } from "react-router";

import { resolveUser, useUser } from "@/users/hooks/users";

import type { Conversation } from "../api/conversations.api";
import type { Relationship } from "../api/relationship.api";
import { conversationTitle, isGroup } from "../utils/friends.util";
import ConversationAvatar from "./ConversationAvatar";

export function SideBarChatItem({
	conv,
	rels,
}: {
	conv: Conversation;
	rels?: Relationship[];
}): JSX.Element {
	const user = useUser();
	const last = conv.lastMessage;

	return (
		<li>
			<NavLink
				to={`/messages/${conv.id}`}
				className={({ isActive }) =>
					[
						"flex gap-2 px-2 py-1.5 text-[14.5px] rounded-base group duration-120",
						isActive
							? "bg-accent-soft text-text"
							: "hover:bg-back hover:text-text",
					].join(" ")
				}
			>
				<ConversationAvatar conv={conv} />
				<div className="flex truncate flex-col justify-center min-w-0">
					<p className="text-text text-[14px] font-semibold truncate">{conversationTitle(conv, rels)}</p>
					{last ? (
						<p className="text-muted text-[14px] block truncate min-w-0">{resolveUser(last.sender, user).userName}: {last.content}</p>
					) : isGroup(conv) && (
						<p className="text-muted text-[13px]">{conv.recipients.length + 1} members</p>
					)}
				</div>
			</NavLink>
		</li>
	);
}
