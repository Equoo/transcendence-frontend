import { type JSX, useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { GoPeople } from "react-icons/go";
import { IoLocationOutline } from "react-icons/io5";
import { PiClock } from "react-icons/pi";
import { Link } from "react-router";

import Badge from "../../components/Badge";
import CheckButton from "../../components/Button/CheckButton";
import Tooltip from "../../components/Tooltip";
import type { EventSummary } from "../api/events.api";
import EventRegisterBtn from "./EventRegisterBtn";

interface CountdownType {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	totalMs: number;
}

function getCountdown(targetDate: Date): CountdownType {
	const diff = targetDate.getTime() - Date.now();
	const totalMs = Math.max(diff, 0);

	const totalSeconds = Math.floor(totalMs / 1000);
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return { days, hours, minutes, seconds, totalMs };
}

function formatCountdown(countdown: CountdownType): string {
	const pad = (value: number): string => String(value).padStart(2, "0");
	if (countdown.totalMs === 0) {
		return "Running";
	}
	if (countdown.days > 0) {
		return `${countdown.days}d ${pad(countdown.hours)}:${pad(countdown.minutes)}:${pad(countdown.seconds)}`;
	}

	return `${pad(countdown.hours)}:${pad(countdown.minutes)}:${pad(countdown.seconds)}`;
}

const MAX_VISIBLE_TAGS = 3;

function Countdown({ date }: { date: Date }): JSX.Element {
	const [countdown, setCountdown] = useState(() => getCountdown(date));

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCountdown(getCountdown(date));
		}, 1000);

		return (): void => {
			clearInterval(intervalId);
		};
	}, [date]);

	return (
		<div
			id="countdown"
			className="flex flex-col font-head font-bold text-2xl @sm:text-3xl tabular-nums whitespace-nowrap"
		>
			{formatCountdown(countdown)}
			{countdown.totalMs === 0 ? (
				<small className="inline-flex items-center gap-1.5 text-good font-semibold text-xs tracking-wider">
					<span className="size-1.5 rounded-full bg-good animate-pulse" />
					LIVE NOW
				</small>
			) : (
				<small className="text-muted font-semibold text-xs tracking-wider">
					BEFORE START
				</small>
			)}
		</div>
	);
}

function EventTags({ tags }: { tags: string[] }): JSX.Element {
	const visible = tags.slice(0, MAX_VISIBLE_TAGS);
	const hidden = tags.slice(MAX_VISIBLE_TAGS);

	return (
		<div className="flex flex-nowrap items-center gap-2 min-w-0">
			{visible.map((tag) => (
				<Badge key={tag} className="max-w-36 min-w-0 shrink">
					<Tooltip
						content={tag}
						onlyWhenTruncated
						className="truncate"
					>
						{tag}
					</Tooltip>
				</Badge>
			))}
			{hidden.length > 0 && (
				<Badge className="shrink-0">
					<Tooltip content={hidden.join(", ")}>
						+{hidden.length}
					</Tooltip>
				</Badge>
			)}
		</div>
	);
}

export default function EventCard({
	event,
}: {
	event: EventSummary;
}): JSX.Element {
	const date = new Date(event.date);
	const formattedDate = date.toLocaleString([], {
		hour: "2-digit",
		minute: "2-digit",
		month: "short",
		day: "2-digit",
		year: "numeric",
	});

	return (
		<div className="@container bg-surface flex w-full max-w-md shrink-0 min-w-0 flex-col gap-4 border border-border rounded-3xl p-5 shadow-main sm:p-8">
			<h2 className="text-2xl @sm:text-3xl font-semibold font-head leading-tight text-text tracking-tight min-w-0">
				<Tooltip
					content={event.name}
					onlyWhenTruncated
					className="block truncate"
				>
					{event.name}
				</Tooltip>
			</h2>

			<div className="flex flex-col gap-3 text-text2 text-sm min-w-0">
				<div className="flex flex-col gap-2 min-w-0">
					<div className="flex items-center gap-2 min-w-0">
						<IoLocationOutline className="shrink-0" />
						<Tooltip
							content={event.location}
							onlyWhenTruncated
							className="truncate"
						>
							{event.location}
						</Tooltip>
					</div>
					<div className="flex items-center gap-2 min-w-0">
						<PiClock className="shrink-0" />
						<Tooltip
							content={formattedDate}
							onlyWhenTruncated
							className="truncate"
						>
							<time dateTime={date.toISOString()}>
								{formattedDate}
							</time>
						</Tooltip>
					</div>
				</div>

				<div className="h-6 min-w-0">
					{event.tags.length > 0 ? (
						<EventTags tags={event.tags} />
					) : (
						<span className="text-muted text-xs italic leading-6">
							No tags
						</span>
					)}
				</div>
			</div>

			<div className="mt-auto flex flex-col gap-4 border-t border-border pt-4">
				<div className="flex gap-3 items-end justify-between">
					<Countdown key={event.id} date={date} />
					<Badge
						border=""
						bg="bg-good-soft"
						text="text-good"
						className="whitespace-nowrap shrink-0"
					>
						<GoPeople className="shrink-0" />
						{event.registeredCount}/{event.size}
						<span className="hidden @xs:block">
							Registered
						</span>
					</Badge>
				</div>

				<div className="flex gap-2.5 items-center justify-between whitespace-nowrap">
					<EventRegisterBtn event={event} />
					<Link to={`/calendar/${event.id}`}>
						<CheckButton discrete>
							Details <FiChevronRight />
						</CheckButton>
					</Link>
				</div>
			</div>
		</div>
	);
}
