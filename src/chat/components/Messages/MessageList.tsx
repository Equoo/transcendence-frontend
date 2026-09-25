import {
	Fragment,
	type JSX,
	type Ref,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { useShallow } from "zustand/react/shallow";

import { useChat } from "@/chat/hooks/chat.hook";
import { useUser } from "@/users/hooks/users.hooks";

import type { Channel } from "../../api/chat.api";
import { useAutoScroll } from "../../hooks/useAutoScroll.hook";
import { useMessagePagination } from "../../hooks/useMessagePagination.hook";
import { useReadReceipts } from "../../hooks/useReadReceipts.hook";
import { useScrollRestoration } from "../../hooks/useScrollRestoration.hook";
import { startsNewDay, startsNewGroup } from "../../utils/message.util";
import { useChatContext } from "../ChatProvider";
import MessageActionBar, {
	type MessageActionBarHandles,
} from "./MessageActionBar";
import MessageDaySeparator from "./MessageDaySeparator";
import MessageRow from "./MessageRow";
import NewMessagesDivider from "./NewMessagesDivider";

export interface MessageListHandles {
	scrollBack: () => void;
}

function useNewMessagesDividerId(channelId: string): string | null {
	const user = useUser();
	const messages = useChat(
		useShallow((state) =>
			Object.values(state.channels[channelId]?.messages ?? []),
		),
	);
	const channels = useChat(
		useShallow((state) => Object.values(state.channels) as Channel[]),
	);
	const ackDate = useChat(
		useShallow((state) => state.channels[channelId]?.ackTime ?? null),
	);

	useEffect(() => {
		if (!user) {
			return;
		}
		channels.forEach((channel) => {
			if (channel.ackTime) {
				return;
			}
			channel.ackTime = user.channelsAckMsg.get(channel.id) ?? null;
		});
	}, [user, channels]);

	const [dividerMsgId, setDividerMsgId] = useState<string | null>(null);
	useEffect(() => {
		if (!ackDate) {
			return;
		}
		const firstUnread = messages.find(
			(msg) => msg.sender.id !== user?.id && msg.sentAt > ackDate,
		);
		// eslint-disable-next-line @eslint-react/set-state-in-effect
		setDividerMsgId(firstUnread?.id ?? null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [channelId, ackDate]);

	return dividerMsgId;
}

function MessageList({
	channelId,
	channelName,
	ref,
}: {
	channelId: string;
	channelName: string;
	ref?: Ref<MessageListHandles>;
}): JSX.Element {
	const containerRef = useRef<HTMLDivElement>(null);
	const actionBarRef = useRef<MessageActionBarHandles>(null);

	const messages = useChat(
		useShallow((state) =>
			Object.values(state.channels[channelId]?.messages ?? []),
		),
	);

	const handleScroll = useMessagePagination(
		channelId,
		containerRef,
		actionBarRef,
	);
	useScrollRestoration(channelId, containerRef);
	const { scrollToBottom } = useAutoScroll(channelId, containerRef);
	const lastMessageRef = useReadReceipts(channelId);
	const dividerMsgId = useNewMessagesDividerId(channelId);

	useImperativeHandle(ref, () => ({ scrollBack: scrollToBottom }), [
		scrollToBottom,
	]);

	const { getChatMode } = useChatContext();
	const [chatMode, modeTarget] = getChatMode();
	const isModeTarget = (msgId: string): boolean =>
		chatMode !== "default" && modeTarget?.id === msgId;

	const showActionBar = (
		ev: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>,
	): void => actionBarRef.current?.show(ev);
	const hideActionBar = (): void => actionBarRef.current?.hide();

	return (
		<div
			className="flex flex-1 min-h-0 flex-col overflow-y-auto pt-5"
			ref={containerRef}
			onScroll={handleScroll}
		>
			<MessageActionBar ref={actionBarRef} channelId={channelId} />

			<div className="mt-auto" />
			<div className="relative gap-3 px-5.5 text-muted">
				<h1 className="text-3xl font-medium text-text"><span className="font-bold">#</span> {channelName}</h1>
				<p>Discussion start here</p>
			</div>
			{messages.map((msg, index) => {
				const previous = messages[index - 1];
				const isLast = index === messages.length - 1;

				return (
					<Fragment key={msg.id}>
						{dividerMsgId === msg.id && <NewMessagesDivider />}
						{startsNewDay(msg, previous) && (
							<MessageDaySeparator date={new Date(msg.sentAt)} />
						)}
						<MessageRow
							message={msg}
							showHeader={startsNewGroup(msg, previous)}
							isFocused={isModeTarget(msg.id)}
							rowRef={isLast ? lastMessageRef : null}
							onActivate={showActionBar}
							onDeactivate={hideActionBar}
						/>
					</Fragment>
				);
			})}
		</div>
	);
}

export default MessageList;
