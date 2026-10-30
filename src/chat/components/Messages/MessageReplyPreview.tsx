import type { JSX } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";

import ProfilePic from "@/components/Profile/ProfilePic";
import { useRelationships } from "@/friends/hooks/useRelationships";
import { displayName } from "@/friends/utils/friends.util";
import { useResolvedUserNull } from "@/users/hooks/users";

import type { Message } from "../../api/chat.api";
import { previewMessageContent } from "../../utils/message.util";

function MessageReplyPreview({
	message,
	onClick,
}: {
	message: Message | null;
	onClick?: (msg: Message) => void;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const sender = useResolvedUserNull(message?.sender);
	const { data: rels } = useRelationships();

	return (
		<div
			className="border-l-4 border-accent pl-2 flex flex-row cursor-pointer"
			onClick={() => {
				if (message && onClick) {
					onClick(message);
				}
			}}
		>
			{message && sender ? (<>
				<ProfilePic user={sender} size={1} />
				<div className="flex flex-col min-w-0 mx-1">
					<span className="font-head text-[14.5px] text-text truncate">
						{displayName(sender, rels)}
					</span>
					<span className="text-[14.5px] text-text2 whitespace-pre-wrap wrap-break-word line-clamp-6">
						{previewMessageContent(message.content)}
					</span>
				</div>
			</>) : (
				<div className="flex flex-col min-w-0 mx-1">
					<span className="text-[14.5px] text-text2 whitespace-pre-wrap wrap-break-word line-clamp-6">
						{t("chat.originalDeleted")}
					</span>
				</div>
			)}
		</div>
	);
}

export default MessageReplyPreview;
