import { type JSX, useEffect, useState } from "react";
import CheckButton from "../CheckButton";
import EventBadge from "./EventBadge";
import type { EventData } from "../../lib/events";
import { FiChevronRight } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";

interface Countdown {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	totalMs: number;
}

function getCountdown(targetDate: string): Countdown {
	const diff = new Date(targetDate).getTime() - Date.now();
	const totalMs = Math.max(diff, 0);

	const totalSeconds = Math.floor(totalMs / 1000);
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return { days, hours, minutes, seconds, totalMs };
}

function formatCountdown(countdown: Countdown): string {
	const pad = (value: number): string => String(value).padStart(2, "0");

	if (countdown.days > 0) {
		return `${countdown.days}d ${pad(countdown.hours)}:${pad(countdown.minutes)}:${pad(countdown.seconds)}`;
	}

	return `${pad(countdown.hours)}:${pad(countdown.minutes)}:${pad(countdown.seconds)}`;
}

export default function EventCard({
	event,
}: {
	event: EventData;
}): JSX.Element {
	const [presence, setPresence] = useState<"here" | "maybe" | "">();
	const [countdown, setCountdown] = useState(() => getCountdown(event.date));

	function handlePresence(btn: "here" | "maybe" | ""): void {
		btn === presence ? setPresence("") : setPresence(btn);
	}

	useEffect(() => {
		const intervalId = window.setInterval(() => {
			setCountdown(getCountdown(event.date));
		}, 1000);

		return (): void => {
			window.clearInterval(intervalId);
		};
	}, [event.date]);

	return (
		<div className="bg-surface flex max-w-lg grow sm:min-w-md min-w-sm h-fit flex-col gap-4 overflow-hidden border border-border rounded-3xl p-6 shadow-main sm:p-8">
			<div className="flex flex-nowrap items-center gap-2.5 overflow-auto whitespace-nowrap scrollbar-thin pb-1">
				{event.tags.map((tag) => (
					<EventBadge key={tag}>{tag}</EventBadge>
				))}
			</div>
			<h2 className=" text-3xl font-semibold font-head leading-8 text-text tracking-tight">
				{event.name}
			</h2>
			<div className="inline-flex items-center text-text2 text-sm gap-2">
				<IoLocationOutline />
				<span>{event.location}</span>
			</div>
			<div className="flex gap-3 justify-between items-end">
				<div
					id="countdown"
					className="flex flex-col font-head font-bold text-3xl"
				>
					{formatCountdown(countdown)}
					<small className="text-muted font-semibold text-xs tracking-wider">
						BEFORE START
					</small>
				</div>
				<EventBadge border="" bg="bg-good-soft" text="text-good">
					<GoPeople />
					21/{event.size} Registered
				</EventBadge>
			</div>
			<div className="flex flex-wrap gap-2.5 items-center whitespace">
				<CheckButton
					active={presence === "here"}
					onClick={() => {
						handlePresence("here");
					}}
				>
					I'm here
				</CheckButton>
				<CheckButton
					active={presence === "maybe"}
					onClick={() => {
						handlePresence("maybe");
					}}
				>
					Maybe
				</CheckButton>
				<div className="ml-auto">
					<CheckButton discrete>
						Details <FiChevronRight />
					</CheckButton>
				</div>
			</div>
		</div>
	);
}
