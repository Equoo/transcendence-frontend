import {
	addDays,
	addMonths,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isSameDay,
	isSameMonth,
	startOfMonth,
	startOfToday,
	startOfWeek,
} from "date-fns";
import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { PiCalendarBlank } from "react-icons/pi";
import { Link } from "react-router";

import { PermEnum } from "../admin/api/roles";
import Promisable from "../components/Promisable";
import { type EventRole, fetchEventRoles } from "../events/api/event_roles.api";
import { type EventSummary, fetchEvents } from "../events/api/events.api";
import EventForm from "../events/components/EventForm";
import EventList from "../events/components/EventList";
import { type AppFile, fetchFiles } from "../files/api/files.api";
import { HEADER_PADDING } from "../friends/components/BackToList";
import { type User, UserContext } from "../users/api/users";
import type { Route } from "./+types/calendar_page";

let cachedEvents: EventSummary[] | undefined;

export function clientLoader({ context }: Route.LoaderArgs): {
	previousEvents: EventSummary[] | undefined;
	events: Promise<EventSummary[]>;
	roles: Promise<EventRole[]>;
	files: Promise<AppFile[]>;
	user: User;
} {
	const previousEvents = cachedEvents;
	const events = fetchEvents().then((result) => (cachedEvents = result));

	return {
		previousEvents,
		events,
		roles: fetchEventRoles(),
		files: fetchFiles(),
		user: context.get(UserContext),
	};
}

function DayEvents({
	events,
	day,
}: {
	events: EventSummary[];
	day: Date;
}): JSX.Element {
	const dayEvents = events.filter((ev) => isSameDay(ev.date, day));

	return (
		<>
			<div className="mt-1 flex flex-wrap justify-center gap-0.5 sm:hidden">
				{dayEvents.map((ev) => (
					<span
						key={ev.id}
						className={`size-1.5 rounded-full ${ev.size === ev.registeredCount ? "bg-muted" : "bg-accent"}`}
					/>
				))}
			</div>
			<div className="mt-1 mb-0.75 w-9/10 overflow-y-auto hidden sm:flex flex-col gap-0.5">
				{dayEvents.map((ev) => (
					<Link
						to={`/calendar/${ev.id}`}
						key={ev.id}
						className={`text-xs px-1 w-full truncate font-light text-white rounded-xs hover:bg-accent/90
						${ev.size === ev.registeredCount ? "bg-muted" : "bg-accent"}`}
					>
						{ev.name}
					</Link>
				))}
			</div>
		</>
	);
}

export default function Calendar({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [selectedDay, setSelectedDay] = useState(() => startOfToday());
	const [month, setMonth] = useState(() => startOfMonth(selectedDay));

	const weekStart = startOfWeek(month, { weekStartsOn: 1 });
	const days = eachDayOfInterval({
		start: weekStart,
		end: addDays(weekStart, 6),
	});

	const monthDays = eachDayOfInterval({
		start: startOfWeek(month, { weekStartsOn: 1 }),
		end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
	});

	return (
		<main className="flex flex-col w-full min-h-full">
			<div
				className={`flex flex-none items-center gap-3 border-b justify-between border-border py-3 ${HEADER_PADDING}`}
			>
				<h1 className="font-head font-[650] text-[17px] text-text inline-flex gap-2 items-center">
					<PiCalendarBlank size={20} className="text-muted" />
					{t("sidebar.calendar")}
				</h1>
				{Boolean(
					loaderData.user.role.permission & PermEnum.HandleEvent,
				) && (
					<EventForm
						roles={loaderData.roles}
						files={loaderData.files}
					/>
				)}
			</div>

			<div className="w-full max-w-6xl mx-auto px-2 sm:px-6 mt-2">
				<div className="flex w-full items-center justify-between p-2 sm:p-4">
					<button
						type="button"
						className="p-1.5 rounded-xl text-text2 hover:bg-hover hover:text-text cursor-pointer"
						onClick={() => {
							setMonth(addMonths(month, -1));
						}}
					>
						<FiChevronLeft size={21} />
					</button>
					<div className="text-text font-head font-semibold select-none capitalize">
						{format(month, "MMMM yyyy")}
					</div>
					<button
						type="button"
						className="p-1.5 rounded-xl text-text2 hover:bg-hover hover:text-text cursor-pointer"
						onClick={() => {
							setMonth(addMonths(month, 1));
						}}
					>
						<FiChevronRight size={21} />
					</button>
				</div>
				<div className="mt-2 grid w-full grid-cols-7 place-items-center text-sm sm:text-base">
					{days.map((day) => (
						<span key={day.toString()} className="text-text2">
							<span className="sm:hidden">
								{format(day, "EEEEE")}
							</span>
							<span className="hidden sm:inline">
								{format(day, "EEE")}
							</span>
						</span>
					))}
				</div>
				<div className="mt-1 grid w-full grid-cols-7 bg-border2 border-2 border-border2 gap-0.5 place-items-center">
					{monthDays.map((day) => (
						<div
							key={day.toString()}
							className="group flex pt-1 flex-col items-center w-full h-14 sm:h-22 lg:h-26 bg-surface cursor-pointer"
							onClick={() => {
								setSelectedDay(day);
							}}
						>
							<div
								className={`rounded-full size-7 sm:size-8 shrink-0 aspect-square text-center place-content-center text-sm sm:text-base
								${isSameMonth(day, month) || "text-muted"}
								${isSameDay(day, selectedDay) ? "bg-accent text-white" : "group-hover:bg-accent/20"}
								`}
							>
								{format(day, "d")}
							</div>
							<Promisable
								data={loaderData.events}
								skeleton={
									loaderData.previousEvents ? (
										<DayEvents
											events={loaderData.previousEvents}
											day={day}
										/>
									) : (
										<div className="mt-1 mb-2 w-9/10 h-full flex flex-col gap-0.5 bg-back2 animate-pulse rounded-xl" />
									)
								}
							>
								{(events) => (
									<DayEvents events={events} day={day} />
								)}
							</Promisable>
						</div>
					))}
				</div>
			</div>
			<Promisable
				data={loaderData.events}
				cached_data={loaderData.previousEvents}
			>
				{(events) => (
					<EventList
						previousEvents={loaderData.previousEvents}
						events={events.filter((ev) =>
							isSameDay(ev.date, selectedDay),
						)}
					/>
				)}
			</Promisable>
		</main>
	);
}
