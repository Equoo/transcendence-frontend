import type { JSX } from "react/jsx-runtime";

import ProfilePic from "@/components/Profile/ProfilePic";

import type { Message } from "../../api/chat.api";

function MessageReplyPreview({
	message,
	onClick,
}: {
	message: Message;
	onClick?: (msg: Message) => void;
}): JSX.Element {
	return (
		<div
			className="border-l-4 border-accent pl-2 flex flex-row cursor-pointer"
			onClick={() => {
				if (onClick) {
					onClick(message);
				}
			}}
		>
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
