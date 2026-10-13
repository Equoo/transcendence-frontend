import type { JSX } from "react/jsx-runtime";
import { NavLink } from "react-router";

import ProfilePic from "@/components/Profile/ProfilePic";
import { useUser } from "@/users/hooks/users";

import type { Conversation } from "../api/conversations.api";

export function SideBarChatItem({
	conv
}: {
	conv: Conversation
}): JSX.Element | null {
	const to = `/messages/${conv.id}`;

	const user = useUser();
	if (!user) { return null; }
	const relation = conv.recipients.find((us) => us.id !== user.id);
	if (!relation) { return null; }

	return (
		<li
			key={conv.id}
			className=""
		>
			<NavLink
				key={conv.id}
				to={to}
				className={({ isActive }) =>
					[
						"flex gap-2 px-2 py-1.5 text-[14.5px] rounded-base group duration-120",
						isActive
							? "bg-accent-soft text-text"
							: "hover:bg-back hover:text-text",
					].join(" ")
				}
			>
				{({ isActive, isPending }) => (
					<>
						{/* {isPending && ( */}
						{/* 	<TbLoader2 className="animate-spin min-w-5" /> */}
						{/* )} */}
						<ProfilePic user={relation} size={1} status></ProfilePic>
						<div className="flex truncate flex-col justify-center">
							<p className="text-text text-[14px] font-semibold">{relation.userName}</p>
							{conv.lastMessage && (
								<p className="text-muted text-[14px] block truncate min-w-0">{conv.lastMessage.sender.userName}: {conv.lastMessage.content}</p>
							)}
						</div>
					</>
				)}
			</NavLink>
		</li>
	);
}

