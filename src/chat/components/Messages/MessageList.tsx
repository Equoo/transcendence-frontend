import {
	Fragment,
	type JSX,
	type Ref,
	useEffect,
	useImperativeHandle,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { useTranslation } from "react-i18next";

import { useRelationships } from "@/friends/hooks/useRelationships";
import { useScrollPagination } from "@/hooks/usePagination";
import { useUser } from "@/users/hooks/users";
import { toastError } from "@/utils/error.util";

import { ChannelType, type Message } from "../../api/chat.api";
import { useAutoScroll } from "../../hooks/useAutoScroll.hook";
import { useAckTime } from "../../hooks/useChannels";
import {
	useLoadLatestMessages,
	useLoadMessagesAround,
	useMessages,
} from "../../hooks/useMessages";
import { useReadReceipts } from "../../hooks/useReadReceipts.hook";
import { useScrollRestoration } from "../../hooks/useScrollRestoration.hook";
import { startsNewDay, startsNewGroup } from "../../utils/message.util";
import { useChatContext } from "../ChatProvider";
import JumpToPresentButtons, { useScrolledUp } from "./JumpToPresentButtons";
import MessageActionBar, {
	type MessageActionBarHandles,
} from "./MessageActionBar";
import MessageDaySeparator from "./MessageDaySeparator";
import MessageRow from "./MessageRow";
import NewMessagesDivider from "./NewMessagesDivider";

const FOCUS_DURATION_MS = 3000;

function focusMessage(
	container: HTMLElement,
	id: string,
	behavior: ScrollBehavior,
): boolean {
	const el = container.querySelector<HTMLElement>(
		`[data-id="${CSS.escape(id)}"]`,
	);
	if (!el) {
		return false;
	}

	el.scrollIntoView({ behavior, block: "center" });
	el.dataset.focus = "true";
	setTimeout(() => {
		el.dataset.focus = "false";
	}, FOCUS_DURATION_MS);
	return true;
}

export interface MessageListHandles {
	scrollBack: () => void;
}

function useNewMessagesDividerId(
	channelId: string,
	messages: Message[],
): string | null {
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
	channelType,
	ref,
}: {
	channelId: string;
	channelName: string;
	channelType: ChannelType;
	ref?: Ref<MessageListHandles>;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const containerRef = useRef<HTMLDivElement>(null);
	const actionBarRef = useRef<MessageActionBarHandles>(null);

	const { data: relations, isPending: isPendingRelations } =
		useRelationships();

	const {
		data,
		error,
		isPending,
		isFetchNextPageError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		fetchPreviousPage,
		hasPreviousPage,
		isFetchingPreviousPage,
	} = useMessages(channelId);
	const messages = data ?? [];

	useEffect(() => {
		if (isFetchNextPageError) {
			toastError(error);
		}
	}, [error, isFetchNextPageError]);

	const isReady = !isPending && !isPendingRelations;
	const paginateOlder = useScrollPagination({
		containerRef,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		direction: "up",
		threshold: 148,
		enabled: isReady && !isFetchingPreviousPage,
		resetKey: channelId,
	});
	const paginateNewer = useScrollPagination({
		containerRef,
		fetchNextPage: fetchPreviousPage,
		hasNextPage: hasPreviousPage,
		isFetchingNextPage: isFetchingPreviousPage,
		direction: "down",
		enabled: isReady && !isFetchingNextPage,
		resetKey: channelId,
	});
	const [isScrolledUp, trackScrolledUp] = useScrolledUp();
	const handleScroll = (ev: React.UIEvent<HTMLDivElement>): void => {
		paginateOlder(ev);
		paginateNewer(ev);
		actionBarRef.current?.hide();
		trackScrolledUp(ev);
	};

	useScrollRestoration(
		channelId,
		containerRef,
		!isPending && !isPendingRelations,
	);
	const { scrollToBottom } = useAutoScroll(
		messages,
		containerRef,
		!hasPreviousPage,
	);
	const lastMessageRef = useReadReceipts(channelId, messages);
	const dividerMsgId = useNewMessagesDividerId(channelId, messages);

	const loadLatestMessages = useLoadLatestMessages(channelId);
	const [jumpToPresentChannel, setJumpToPresentChannel] = useState<
		string | null
	>(null);

	useLayoutEffect(() => {
		const el = containerRef.current;
		if (!el || jumpToPresentChannel !== channelId) {
			return;
		}
		el.scrollTop = el.scrollHeight;
		// eslint-disable-next-line @eslint-react/set-state-in-effect
		setJumpToPresentChannel(null);
	}, [data, jumpToPresentChannel, channelId]);

	const jumpToPresent = (): void => {
		if (!hasPreviousPage) {
			scrollToBottom();
			return;
		}
		loadLatestMessages()
			.then(() => {
				setJumpToPresentChannel(channelId);
			})
			.catch((err: unknown) => {
				toastError(err as Error);
			});
	};

	useImperativeHandle(ref, () => ({ scrollBack: jumpToPresent }));

	const { getChatMode } = useChatContext();
	const [chatMode, modeTarget] = getChatMode();
	const isModeTarget = (msgId: string): boolean =>
		chatMode !== "default" && modeTarget?.id === msgId;

	const showActionBar = (
		ev: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>,
	): void => actionBarRef.current?.show(ev);
	const hideActionBar = (): void => actionBarRef.current?.hide();

	const loadMessagesAround = useLoadMessagesAround(channelId);
	const [gotoTarget, setGotoTarget] = useState<{
		channelId: string;
		id: string;
	} | null>(null);

	useLayoutEffect(() => {
		const el = containerRef.current;
		if (!el || gotoTarget?.channelId !== channelId) {
			return;
		}
		if (focusMessage(el, gotoTarget.id, "instant")) {
			setGotoTarget(null);
		}
	}, [data, gotoTarget, channelId]);

	const goto = (msg: Message): void => {
		const el = containerRef.current;
		if (!el || focusMessage(el, msg.id, "smooth")) {
			return;
		}

		loadMessagesAround(msg.sentAt)
			.then(() => {
				setGotoTarget({ channelId, id: msg.id });
			})
			.catch((err: unknown) => {
				toastError(err as Error);
			});
	};

	return (
		<div className="relative flex flex-1 min-h-0 flex-col">
			<JumpToPresentButtons
				isDetached={hasPreviousPage}
				isScrolledUp={isScrolledUp}
				onClick={jumpToPresent}
			/>
			<div
				className="flex flex-1 min-h-0 flex-col overflow-y-auto pt-5"
				ref={containerRef}
				onScroll={handleScroll}
			>
				<MessageActionBar ref={actionBarRef} channelId={channelId} />

				<div className="mt-auto" />
				<div className="relative gap-3 px-5.5 text-muted">
					<h1 className="text-3xl font-medium text-text">
						{channelType === ChannelType.Text && (
							<span className="font-bold">#</span>
						)}{" "}
						{channelName}
					</h1>
					<p>{t("chat.discussionStart")}</p>
				</div>
				{messages.map((msg, index) => {
					const previous = messages[index - 1];
					const isLast = index === messages.length - 1;

					return (
						<Fragment key={msg.id}>
							{dividerMsgId === msg.id && <NewMessagesDivider />}
							{startsNewDay(msg, previous) && (
								<MessageDaySeparator
									date={new Date(msg.sentAt)}
								/>
							)}
							<MessageRow
								message={msg}
								showHeader={startsNewGroup(msg, previous)}
								isFocused={isModeTarget(msg.id)}
								rowRef={isLast ? lastMessageRef : null}
								onActivate={showActionBar}
								onDeactivate={hideActionBar}
								className="px-5.5"
								relations={relations}
								onClickReply={goto}
							/>
						</Fragment>
					);
				})}
			</div>
		</div>
	);
}

export default MessageList;
