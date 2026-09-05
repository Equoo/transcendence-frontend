import { isSameDay, isSameMinute } from "date-fns";
import {
	Fragment,
	type JSX,
	type ReactNode,
	type Ref,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { toArray } from "react-emoji-render";
import { useShallow } from "zustand/react/shallow";

import { useChat } from "@/chat/hooks/chat.hook";
import ProfilePic from "@/components/ProfilePic";
import { usePrevious } from "@/hooks/usePrevious";

import { fetchMessages, type Message } from "../api/chat.api";
import { useChatContext } from "./ChatProvider";
import MessageActionBar, {
	type MessageActionBarHandles,
} from "./MessageActionBar";
import MessageDaySeparator from "./MessageDaySeparator";

export interface MessageListHandles {
	scrollBack: () => void;
}

function MessageList({
	channelId,
	ref,
}: {
	channelId: string;
	ref?: Ref<MessageListHandles>;
}): JSX.Element {
	const bottomRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const loadedChannelRef = useRef<string | null>(null);
	const actionBarRef = useRef<MessageActionBarHandles>(null);

	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const messages = useChat(
		useShallow((state) => state.channels[channelId]?.messages ?? []),
	);
	const appendMsgs = useChat((state) => state.appendMsgs);
	const THRESHOLD = 50;

	const loadMessages = useCallback(
		async (limit = 10): Promise<void> => {
			if (loading || !hasMore || channelId === "") {
				return;
			}
			setLoading(true);

			const el = containerRef.current;
			const prevScrollHeight = el?.scrollHeight ?? 0;

			const before = messages[0] ? messages[0].sentAt : null;
			const older = await fetchMessages(channelId, limit, before);
			if (loadedChannelRef.current !== channelId) {
				return;
			}

			if (older.length === 0) {
				setHasMore(false);
			} else {
				appendMsgs(channelId, older);
			}

			setLoading(false);

			// Preserve scroll position after prepending
			requestAnimationFrame(() => {
				if (el) {
					const newScrollHeight = el.scrollHeight;
					el.scrollTop = newScrollHeight - prevScrollHeight;
				}
			});
		},
		[loading, hasMore, messages, channelId, appendMsgs],
	);

	const handleScroll = (ev: React.UIEvent<HTMLDivElement>): void => {
		const el = ev.currentTarget;
		if (el.scrollTop <= THRESHOLD) {
			void loadMessages();
		}
	};

	const parseContent = (value: string): ReactNode => {
		const emojisArray = toArray(value) as ReactNode[];

		const isOnlyWhitespace = (str: string): boolean => !str.trim();

		const isEmojiOnly = emojisArray.every((node: ReactNode): boolean => {
			if (typeof node === "string") {
				if (isOnlyWhitespace(node)) {
					return true;
				}
				return false;
			}
			return true;
		}, "");

		if (isEmojiOnly) {
			return <span className="text-4xl">{emojisArray}</span>;
		}
		return <>{emojisArray}</>;
	};

	useEffect(() => {
		if (loadedChannelRef.current === channelId) {
			return;
		}
		loadedChannelRef.current = channelId;
		// NOTE: when having to high screen may not load enougth to be able to scroll
		// Important to being able to load older messages
		void loadMessages(40);
	}, [channelId, loadMessages]);


	const sleep = async (ms: number): Promise<unknown> =>
		new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	const scrollBack = (): void => {
		void sleep(100).then(() => {
			bottomRef.current?.scrollIntoView({ behavior: "smooth" });
		});
	}

	const prevMessages: Message[] | null = usePrevious(messages) as Message[] | null;
	useEffect(() => {
		if (prevMessages && prevMessages[prevMessages.length - 1]?.id !== messages[messages.length - 1]?.id) {
			scrollBack();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messages, prevMessages])

	useImperativeHandle(ref, () => ({ scrollBack }));

	const { getChatMode } = useChatContext();
	const [chatMode, modeTarget] = getChatMode();

	const oldDate = new Date("1970-01-01T00:00:00");
	return (
		<div
			className="flex flex-1 min-h-0 flex-col overflow-y-auto pt-5"
			ref={containerRef}
			onScroll={handleScroll}
		>
			<MessageActionBar
				ref={actionBarRef}
				channelId={channelId}
			></MessageActionBar>

			<div className="mt-auto" />
			{messages.map((msg, index) => {
				const date = new Date(msg.sentAt);
				const separate = !isSameDay(
					date,
					messages[index - 1]?.sentAt ?? oldDate,
				);
				const notSameTime = !(
					messages[index - 1]?.sender.id === msg.sender.id &&
					isSameMinute(date, messages[index - 1]?.sentAt ?? oldDate)
				);

				return (
					<Fragment key={msg.id}>
						{separate && <MessageDaySeparator date={date} />}
						<div
							onMouseEnter={(ev) =>
								actionBarRef.current?.show(ev)
							}
							onFocus={(ev) => actionBarRef.current?.show(ev)}
							onMouseLeave={() => actionBarRef.current?.hide()}
							className={`relative gap-3 ${notSameTime ? "mt-4.5" : "mt-0.75"} px-5.5 hoer:bg-back2 aria-selected:bg-back2 data-[pending=true]:animate-pulse data-[focus=true]:bg-accent-soft`}
							key={msg.id}
							data-id={msg.id}
							data-pending={msg.status === "pending"}
							data-focus={chatMode !== "default" && modeTarget?.id === msg.id}
						>
							{notSameTime && (
								<ProfilePic
									className="absolute"
									name={msg.sender.userName}
									size={10}
								/>
							)}
							<div className="ml-12">
								{notSameTime && (
									<div className="mb-0.75 flex items-baseline gap-2.25">
										<span className="font-head font-[650] text-[14.5px]">
											{msg.sender.userName}
										</span>
										<span className="text-[11.5px] text-muted">
											{date.toLocaleString("en-EN", {
												hour: "2-digit",
												minute: "2-digit",
												month: "2-digit",
												day: "2-digit",
												year: "numeric",
											})}
										</span>
									</div>
								)}
								<div className="whitespace-pre-wrap wrap-break-word text-[14.5px] leading-normal text-text ">
									{parseContent(msg.content)}
									{msg.editAt && (<span className="text-[11.5px] text-muted"> (edtited)</span>)}
								</div>
							</div>
							{/* {m.react && ( */}
							{/* 	<span className="mt-2 inline-flex items-center gap-[5px] rounded-full border border-border bg-surface px-[9px] py-[2px] text-[12px] font-semibold text-text-2"> */}
							{/* 		{m.react} */}
							{/* 	</span> */}
							{/* )} */}
						</div>
					</Fragment>
				);
			})}
			<div ref={bottomRef} />
		</div>
	);
}

export default MessageList;
