import { type JSX, type ReactNode, useRef, useEffect } from "react";
import type { IconType } from "react-icons";
import { NavLink } from "react-router";
import type { Message } from "../../models/chat"
import MessageDaySeparator from "./MessageDaySeparator"
import ProfilePic from "../ProfilePic"

function isSameDay(d1: Date, d2: Date): boolean {
	return (
		d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate()
	);
}

function MessageList({
	msgs
}: {
	msgs: Message;
}): JSX.Element {
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [msgs]);

	let last_date = new Date("1970-01-01T00:00:00");
	return (
		<div className="flex flex-1 min-h-0 flex-col gap-[18px] overflow-y-auto px-[22px] pt-5">
			<div className="mt-auto" />
			{msgs.map(m => {
				const date = new Date(m.sentAt);
				const notSameDay = !isSameDay(date, last_date);
				last_date = date;
	
				return (
				<>
					{notSameDay && (
						<MessageDaySeparator date={date}/>
					)}
					<div className="flex items-start gap-3" key={m.id}>
						<ProfilePic name={m.sender.userName} size={10} />
						<div className="min-w-0 flex-1">
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
							</div>
							<div className="whitespace-pre-wrap text-[14.5px] leading-[1.5] text-text">
								{m.content}
							</div>
							{/* {m.react && ( */}
							{/* 	<span className="mt-2 inline-flex items-center gap-[5px] rounded-full border border-border bg-surface px-[9px] py-[2px] text-[12px] font-semibold text-text-2"> */}
							{/* 		{m.react} */}
							{/* 	</span> */}
							{/* )} */}
						</div>
					</div>
				</>
				)
			})}
			<div ref={bottomRef} />
		</div>
	);
}

export default MessageList;
