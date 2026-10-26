import { type JSX, type Ref, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import ProfilePic from "@/components/Profile/ProfilePic";
import type { Relationship } from "@/friends/api/relationship.api";
import { displayName } from "@/friends/utils/friends.util";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useLongPress } from "@/hooks/useLongPress";
import ProfileUser from "@/users/components/ProfileUser";
import { resolveUser, useUser } from "@/users/hooks/users";

import type { Message } from "../../api/chat.api";
import MessageContent from "./MessageContent";
import MessageReplyPreview from "./MessageReplyPreview";

type ActivateEvent =
	React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>;

interface MessageRowProps {
	message: Message;
	showHeader: boolean;
	isFocused?: boolean;
	rowRef?: Ref<HTMLDivElement> | null;
	onActivate?: (ev: ActivateEvent) => void;
	onDeactivate?: () => void;
	onLongPress?: (row: HTMLDivElement) => void;
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
	onLongPress,
	className,
	relations,
	onClickReply,
}: MessageRowProps): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const user = useUser();
	const sender = resolveUser(message.sender, user);
	const [showWatch, setShowWatch] = useState(false);
	const watchRef = useRef<HTMLDivElement>(null);

	useClickOutside(watchRef, (): void => {
		setShowWatch(false);
	});

	const longPress = useLongPress(
		(_point, target) => {
			onLongPress?.(target as HTMLDivElement);
		},
		{ disabled: !onLongPress },
	);

	return (
		<div
			ref={rowRef}
			data-id={message.id}
			data-pending={message.status === "pending"}
			data-focus={isFocused}
			onMouseEnter={onActivate}
			onFocus={onActivate}
			onMouseLeave={onDeactivate}
			{...(onLongPress && longPress)}
			className={`flex items-center relative shrink-0 ${onLongPress ? "hold-fill no-callout" : ""} ${showHeader ? "mt-4.5" : "mt-0.75"} hover:bg-back2 aria-selected:bg-back2 data-[pending=true]:animate-pulse data-[focus=true]:bg-accent-soft ${className}`}
		>
			{showHeader && (<div className="absolute top-0">
				<ProfilePic
					watch={sender.id !== user?.id}
					user={sender}
					size={1}
				/>
			</div>)}
			{showWatch && sender.id !== user?.id && (
				<div ref={watchRef} className="absolute bottom-7 left-15">
					<ProfileUser user={sender}></ProfileUser>
				</div>
			)}
			<div className="min-w-0 ml-12">
				{showHeader && (
					<div className="mb-0.75 flex items-baseline gap-2.25">
						<span
							// eslint-disable-next-line no-negated-condition
							className={`${sender.id !== user?.id ? "hover:underline hover:cursor-pointer" : ""} font-main font-[650] text-[14.5px]`}
							onClick={() => {
								setShowWatch(true);
							}}
						>
							{displayName(sender, relations)}
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
