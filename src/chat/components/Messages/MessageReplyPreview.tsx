import type { JSX } from "react/jsx-runtime";

import ProfilePic from "@/components/Profile/ProfilePic";
import { useResolvedUser } from "@/users/hooks/users";

import type { Message } from "../../api/chat.api";

function MessageReplyPreview({
	message,
	onClick,
}: {
	message: Message;
	onClick?: (msg: Message) => void;
}): JSX.Element {
	const sender = useResolvedUser(message.sender);

	return (
		<div
			className="border-l-4 border-accent pl-2 flex flex-row cursor-pointer"
			onClick={() => {
				if (onClick) {
					onClick(message);
				}
			}}
		>
			<ProfilePic user={sender} size={1} />
			<div className="flex flex-col min-w-0 mx-1">
				<span className="font-head text-[14.5px] text-text">
					{sender.userName}
				</span>
				<span className="text-[14.5px] text-text2 whitespace-pre-wrap wrap-break-word line-clamp-6">
					{message.content}
				</span>
			</div>
		</div>
	);
}

export default MessageReplyPreview;
