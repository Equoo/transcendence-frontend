import { type JSX, useEffect, useState } from "react";
import CheckButton from "../CheckButton";
import EventBadge from "./EventBadge";
import type { EventData } from "../../models/events";
import { FiChevronRight } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { PiClock } from "react-icons/pi";
import type { RegistrationActionResult } from "../../models/registrations";
import { useFetcher } from "react-router";

interface Countdown {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	totalMs: number;
}

function getCountdown(targetDate: Date): Countdown {
	const diff = targetDate.getTime() - Date.now();
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
	if (countdown.totalMs === 0) {
		return "Running";
	}
	if (countdown.days > 0) {
		return `${countdown.days}d ${pad(countdown.hours)}:${pad(countdown.minutes)}:${pad(countdown.seconds)}`;
	}

	return `${pad(countdown.hours)}:${pad(countdown.minutes)}:${pad(countdown.seconds)}`;
}

function Cooldown({ date }: { date: Date }): JSX.Element {
	const [countdown, setCountdown] = useState(() => getCountdown(date));

	useEffect(() => {
		const intervalId = window.setInterval(() => {
			setCountdown(getCountdown(date));
		}, 1000);

		return (): void => {
			window.clearInterval(intervalId);
		};
	}, [date]);

	return (
		<div
			id="countdown"
			className="flex flex-col font-head font-bold text-3xl"
		>
			{formatCountdown(countdown)}
			<small className="text-muted font-semibold text-xs tracking-wider">
				BEFORE START
			</small>
		</div>
	);
}

export default function EventCard({
	event,
}: {
	event: EventData;
}): JSX.Element {
	const fetcher = useFetcher<RegistrationActionResult>();
	const isRegistered = event.registrations.some(
		(reg) => reg.user.userName === "asventi",
	);

	const presence =
		fetcher.state === "idle" ? isRegistered : fetcher.formMethod === "POST";

	return (
		<div className="bg-surface flex max-w-lg grow sm:min-w-md min-w-sm h-fit flex-col gap-4 overflow-hidden border border-border rounded-3xl p-6 shadow-main sm:p-8">
			<h2 className=" text-3xl font-semibold font-head leading-8 text-text tracking-tight">
				{event.name}
			</h2>
			<div className="inline-flex min-h-9 text-text2 text-sm gap-6 justify-between items-start">
				<div className="flex flex-col gap-2">
					<div className="inline-flex items-center gap-2">
						<IoLocationOutline />
						<span>{event.location}</span>
					</div>
					<div className="inline-flex items-center gap-2 text-nowrap">
						<PiClock />
						<span>
							{new Date(event.date).toLocaleString([], {
								hour: "2-digit",
								minute: "2-digit",
								month: "short",
								day: "2-digit",
								year: "numeric",
							})}
						</span>
					</div>
				</div>

				{event.tags.length > 0 && (
					<div className="flex flex-nowrap items-center gap-2.5 overflow-auto whitespace-nowrap scrollbar-thin pb-1.5">
						{event.tags.map((tag) => (
							<EventBadge key={tag}>{tag}</EventBadge>
						))}
					</div>
				)}
			</div>
			<div className="flex gap-3 items-end">
				<Cooldown date={new Date(event.date)} />
				<div className="ml-auto">
					<EventBadge border="" bg="bg-good-soft" text="text-good">
						<GoPeople />
						{event.registrations.length}/{event.size} Registered
					</EventBadge>
				</div>
			</div>
			<div className="flex gap-2.5 items-center whitespace-nowrap">
				<fetcher.Form
					action={`/events/${event.id}/registration`}
					method={isRegistered ? "DELETE" : "POST"}
				>
					<CheckButton
						type="submit"
						active={presence}
						pending={fetcher.state !== "idle"}
						className=""
					>
						I'm here
					</CheckButton>
				</fetcher.Form>
				{fetcher.data?.ok === false && (
					<div className="overflow-x-scroll text-error font-main font-light text-sm">
						{fetcher.data.error}
					</div>
				)}
				<div className="ml-auto">
					<CheckButton discrete>
						Details <FiChevronRight />
					</CheckButton>
				</div>
			</div>
		</div>
	);
}
