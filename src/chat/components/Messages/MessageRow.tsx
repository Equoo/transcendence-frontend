import type { JSX, Ref } from "react";

import ProfilePic from "@/components/ProfilePic";

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
	isFocused: boolean;
	rowRef: Ref<HTMLDivElement> | null;
	onActivate: (ev: ActivateEvent) => void;
	onDeactivate: () => void;
}

function formatTimestamp(date: Date): string {
	return date.toLocaleString("en-EN", {
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
	isFocused,
	rowRef,
	onActivate,
	onDeactivate,
}: MessageRowProps): JSX.Element {
	return (
		<div
			ref={rowRef}
			data-id={message.id}
			data-pending={message.status === "pending"}
			data-focus={isFocused}
			onMouseEnter={onActivate}
			onFocus={onActivate}
			onMouseLeave={onDeactivate}
			className={`relative gap-3 ${showHeader ? "mt-4.5" : "mt-0.75"} px-5.5 hoer:bg-back2 aria-selected:bg-back2 data-[pending=true]:animate-pulse data-[focus=true]:bg-accent-soft`}
		>
			{showHeader && (
				<ProfilePic
					className="absolute"
					user={message.sender}
					size={10}
				/>
			)}
			<div className="ml-12">
				{showHeader && (
					<div className="mb-0.75 flex items-baseline gap-2.25">
						<span className="font-head font-[650] text-[14.5px]">
							{message.sender.userName}
						</span>
						<span className="text-[11.5px] text-muted">
							{formatTimestamp(new Date(message.sentAt))}
						</span>
					</div>
				)}
				{message.messageRef && (
					<MessageReplyPreview message={message.messageRef} />
				)}
				<div className="whitespace-pre-wrap wrap-break-word text-[14.5px] leading-normal text-text ">
					<MessageContent content={message.content} />
					{message.editAt && (
						<span className="text-[11.5px] text-muted">
							{" "}
							(edtited)
						</span>
					)}
				</div>
			</div>
		</div>
	);
}

export default MessageRow;
