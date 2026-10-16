import type { JSX } from "react";
import { PiUsersThree } from "react-icons/pi";

import ProfilePic from "@/components/Profile/ProfilePic";

import type { Conversation } from "../api/conversations.api";
import { isGroup } from "../utils/friends.util";

export default function ConversationAvatar({
	conv,
}: {
	conv: Conversation;
}): JSX.Element {
	if (!isGroup(conv)) {
		return <ProfilePic user={conv.recipients[0]} size={1} status />;
	}
	return (
		<div className="flex items-center justify-center w-10 h-10 min-w-10 rounded-full bg-accent-soft text-accent">
			<PiUsersThree size={22} />
		</div>
	);
}
