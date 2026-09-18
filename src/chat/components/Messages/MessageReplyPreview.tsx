import type { JSX } from "react/jsx-runtime";

import ProfilePic from "@/components/ProfilePic";

import type { Message } from "../../api/chat.api";

/** Compact preview of the message a reply points to. */
function MessageReplyPreview({ message }: { message: Message }): JSX.Element {
	return (
		<div className="border-l-4 border-accent pl-2 flex flex-row cursor-pointer">
			<ProfilePic user={message.sender} size={1} />
			<span className="font-head text-[14.5px] text-text mx-1">
				{message.sender.userName}
			</span>
			<span className="text-[14.5px] text-text2 truncate">
				{message.content}
			</span>
		</div>
	);
}

export default MessageReplyPreview;
