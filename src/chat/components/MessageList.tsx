import {
	Fragment,
	type JSX,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { toArray } from "react-emoji-render";

import { useChat } from "@/chat/hooks/chat.hook";
import ProfilePic from "@/components/ProfilePic";

import { fetchMessages, type Message } from "../api/chat.api";
import MessageDaySeparator from "./MessageDaySeparator";

function isSameDay(d1: Date, d2: Date): boolean {
	return (
		d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate()
	);
}

function inSameMinute(d1: Date, d2: Date): boolean {
	return (
		// === 1 minute
		d1.getTime() - d2.getTime() < 1000 * 60
	);
}

// Const segmenter = new Intl.Segmenter("en-EN", {
// 	Granularity: "grapheme",
// });

// Search for emojis in text by separating Unicode segments using Grapheme
// Function isEmojiOnly(text: string): boolean {
// 	Const graphemes = [...segmenter.segment(text)].map((data) => data.segment);
//
// 	If (graphemes.length > 25) {
// 		Return false;
// 	}
//
// 	Return graphemes.every((gr) => /\p{Extended_Pictographic}/u.test(gr));
// }

function MessageList({
	msgs,
	channelId,
}: {
	msgs: Message[];
	channelId: string;
}): JSX.Element {
	const bottomRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [msgs]);

	const containerRef = useRef<HTMLDivElement>(null);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const appendMsgs = useChat((state) => state.appendMsgs);
	const THRESHOLD = 50;

	const loadOlderMessages = useCallback(async () => {
		if (loading || !hasMore) {
			return;
		}
		setLoading(true);

		const el = containerRef.current;
		const prevScrollHeight = el?.scrollHeight ?? 0;

		const before = msgs[0]?.sentAt;
		const older = await fetchMessages(channelId, 10, before);

		if (older.length === 0) {
			setHasMore(false);
		} else {
			appendMsgs(channelId, older);
		}

		setLoading(false);

		// Preserve scroll position after prepending, once DOM updates
		requestAnimationFrame(() => {
			if (el) {
				const newScrollHeight = el.scrollHeight;
				el.scrollTop = newScrollHeight - prevScrollHeight;
			}
		});
	}, [msgs, loading, hasMore, channelId, appendMsgs]);

	const handleScroll = (ev: React.UIEvent<HTMLDivElement>): void => {
		const el = ev.currentTarget;
		if (el.scrollTop <= THRESHOLD) {
			void loadOlderMessages();
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

	const oldDate = new Date("1970-01-01T00:00:00");
	return (
		<div
			className="flex flex-1 min-h-0 flex-col overflow-y-auto px-5.5 pt-5"
			ref={containerRef}
			onScroll={handleScroll}
		>
			<div className="mt-auto" />
			{msgs.map((msg, index) => {
				const date = new Date(msg.sentAt);
				const separate = !isSameDay(
					date,
					msgs[index - 1]?.sentAt ?? oldDate,
				);
				const notSameTime = !(
					msgs[index - 1]?.sender.id === msg.sender.id &&
					inSameMinute(date, msgs[index - 1]?.sentAt ?? oldDate)
				);

				return (
					<Fragment key={msg.id}>
						{separate && <MessageDaySeparator date={date} />}
						<div
							className={`relative gap-3 ${(notSameTime ? "mt-4.5" : "") || "mt-0.75"}`}
							key={msg.id}
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
								<div className="whitespace-pre-wrap text-[14.5px] leading-normal text-text">
									{parseContent(msg.content)}
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
