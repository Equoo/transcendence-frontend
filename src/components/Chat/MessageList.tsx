import { type JSX, type ReactNode, useRef, useEffect, useState, useCallback } from "react";
import type { IconType } from "react-icons";
import { NavLink } from "react-router";
import { type Message, fetchMessages, useChat } from "../../models/chat"
import MessageDaySeparator from "./MessageDaySeparator"
import ProfilePic from "../ProfilePic"
import { toArray } from "react-emoji-render";

function isSameDay(d1: Date, d2: Date): boolean {
	return (
		d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate()
	);
}

function inSameMinute(d1: Date, d2: Date): boolean {
	return (
		d1.getTime() - d2.getTime() < 1000 * 60 // === 1 minute
	);
}

const segmenter = new Intl.Segmenter(undefined, {
  granularity: "grapheme",
});

function isEmojiOnly(text) {
	const graphemes = [
		...segmenter.segment(text)
	].map(x => x.segment);

	if (graphemes.length > 25)
		return false;

	return graphemes.every((g) =>
		/\p{Extended_Pictographic}/u.test(g)
	);
}

const parseEmojis = value => {
	const emojisArray = toArray(value);

	const newValue = emojisArray.reduce((previous, current) => {
		if (typeof current === "string") {
			return previous + current;
		}
		return previous + current.props.children;
	}, "");

	return newValue;
};

function MessageList({
	msgs,
	channelId
}: {
	msgs: Message;
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
		if (loading || !hasMore) return;
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

		// preserve scroll position after prepending, once DOM updates
		requestAnimationFrame(() => {
		if (el) {
			const newScrollHeight = el.scrollHeight;
			el.scrollTop = newScrollHeight - prevScrollHeight;
		}
		});
	}, [msgs, loading, hasMore, channelId]);

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const el = e.currentTarget;
		if (el.scrollTop <= THRESHOLD) {
			loadOlderMessages();
		}
	};

	let oldDate = new Date("1970-01-01T00:00:00");
	return (
		<div className="flex flex-1 min-h-0 flex-col overflow-y-auto px-[22px] pt-5"
			ref={containerRef} onScroll={handleScroll}>
			<div className="mt-auto" />
			{msgs.map((m, i) => {
				const date = new Date(m.sentAt);
				const separate = !isSameDay(date, msgs[i - 1]?.sentAt ?? oldDate);
				const notSameTime = !inSameMinute(date, msgs[i - 1]?.sentAt ?? oldDate);

				return (<>
					{separate && (
						<MessageDaySeparator date={date}/>
					)}
					<div className={`relative gap-3 ${notSameTime && "mt-[18px]" || "mt-[3px]"}`} key={m.id}>
						{notSameTime &&
							(<ProfilePic className="absolute" name={m.sender.userName} size={10} />)}
						<div className="ml-12">
							{notSameTime && (
							<div className="mb-[3px] flex items-baseline gap-[9px]">
								<span className="font-head font-[650] text-[14.5px]">{m.sender.userName}</span>
								<span className="text-[11.5px] text-muted">{
									date.toLocaleString("en-EN", { // TODO: Localization
										hour: "2-digit",
										minute: "2-digit",
										month: "2-digit",
										day: "2-digit",
										year: "numeric",
									})
								}</span>
							</div>)}
							<div className="whitespace-pre-wrap text-[14.5px] leading-[1.5] text-text">
								{
									isEmojiOnly(m.content)
										&& (<span className="text-4xl">{m.content}</span>)
										|| parseEmojis(m.content)
								}
							</div>
						</div>
						{/* {m.react && ( */}
						{/* 	<span className="mt-2 inline-flex items-center gap-[5px] rounded-full border border-border bg-surface px-[9px] py-[2px] text-[12px] font-semibold text-text-2"> */}
						{/* 		{m.react} */}
						{/* 	</span> */}
						{/* )} */}
					</div>
				</>)
			})}
			<div ref={bottomRef} />
		</div>
	);
}

export default MessageList;
