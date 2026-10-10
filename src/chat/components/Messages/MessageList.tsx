import {
	Fragment,
	type JSX,
	type Ref,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";

import { useScrollPagination } from "@/hooks/usePagination";
import { useUser } from "@/users/hooks/users";

import type { Message } from "../../api/chat.api";
import { useAutoScroll } from "../../hooks/useAutoScroll.hook";
import { useAckTime } from "../../hooks/useChannels";
import { useMessages } from "../../hooks/useMessages";
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

function useNewMessagesDividerId(channelId: string, messages: Message[]): string | null {
	const user = useUser();
	const ackDate = useAckTime(channelId);

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

	const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessages(channelId);
	const messages = data ?? [];

	const paginate = useScrollPagination({
		containerRef,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		direction: "up",
		enabled: !isPending,
		resetKey: channelId,
	});
	const handleScroll = (ev: React.UIEvent<HTMLDivElement>): void => {
		paginate(ev);
		actionBarRef.current?.hide();
	};

	useScrollRestoration(channelId, containerRef, !isPending);
	const { scrollToBottom } = useAutoScroll(messages, containerRef);
	const lastMessageRef = useReadReceipts(channelId, messages);
	const dividerMsgId = useNewMessagesDividerId(channelId, messages);

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
			<div className="relative gap-3 px-5.5 mt- text-muted">
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
							className="px-5.5"
						/>
					</Fragment>
				);
			})}
		</div>
	);
}

export default MessageList;
