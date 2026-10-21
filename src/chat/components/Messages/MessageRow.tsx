import type { JSX, Ref } from "react";
import { useTranslation } from "react-i18next";

import ProfilePic from "@/components/Profile/ProfilePic";
import type { Relationship } from "@/friends/api/relationship.api";
import { displayName } from "@/friends/utils/friends.util";

import type { Message } from "../../api/chat.api";
import MessageContent from "./MessageContent";
import MessageReplyPreview from "./MessageReplyPreview";

type ActivateEvent =
	React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>;

interface MessageRowProps {
	message: Message;
	/** Show the avatar and sender/time header (first message of a group). */
	showHeader: boolean;
	/** Highlighted because it is the target of an edit or reply. */
	isFocused?: boolean;
	rowRef?: Ref<HTMLDivElement> | null;
	onActivate?: (ev: ActivateEvent) => void;
	onDeactivate?: () => void;
	className?: string;
	relations?: Relationship[];
	onClickReply?: (msg: Message) => void;
}

function formatTimestamp(date: Date): string {
	return date.toLocaleString([], {
		hour: "2-digit",
		minute: "2-digit",
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
	});
}

function MessageRow({
	message,
	showHeader,
	isFocused = false,
	rowRef,
	onActivate,
	onDeactivate,
	className,
	relations,
	onClickReply,
}: MessageRowProps): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	return (
		<div
			ref={rowRef}
			data-id={message.id}
			data-pending={message.status === "pending"}
			data-focus={isFocused}
			onMouseEnter={onActivate}
			onFocus={onActivate}
			onMouseLeave={onDeactivate}
			className={`relative gap-3 ${showHeader ? "mt-4.5" : "mt-0.75"} hover:bg-back2 aria-selected:bg-back2 data-[pending=true]:animate-pulse data-[focus=true]:bg-accent-soft ${className}`}
		>
			{showHeader && (
				<ProfilePic
					className="absolute"
					user={message.sender}
					size={1}
				/>
			)}
			<div className="ml-12">
				{showHeader && (
					<div className="mb-0.75 flex items-baseline gap-2.25">
						<span className="font-head font-[650] text-[14.5px]">
							{displayName(message.sender, relations)}
						</span>
						<span className="text-[11.5px] text-muted">
							{formatTimestamp(new Date(message.sentAt))}
						</span>
					</div>
				)}
				{message.messageRef && (
					<MessageReplyPreview
						message={message.messageRef}
						onClick={onClickReply}
					/>
				)}
				<div className="whitespace-pre-wrap wrap-break-word text-[14.5px] leading-normal text-text ">
					<MessageContent content={message.content} />
					{message.editAt && (
						<span className="text-[11.5px] text-muted">
							{" "}
							{t("chat.edited")}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}

export default MessageRow;
