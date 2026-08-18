import {
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
import { type JSX,useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router";

import { type EventRole,fetchEventRoles } from "../events/api/event_roles.api";
import { type EventSummary,fetchEvents } from "../events/api/events.api";
import EventForm from "../events/components/EventForm";
import EventList from "../events/components/EventList";
import Promisable from "../events/components/Promisable";
import { type AppFile,fetchFiles } from "../files/api/files.api";
import type { Route } from "./+types/calendar_page";

export function clientLoader(): {
	events: Promise<EventSummary[]>;
	roles: Promise<EventRole[]>;
	files: Promise<AppFile[]>;
} {
	return {
		events: fetchEvents(),
		roles: fetchEventRoles(),
		files: fetchFiles(),
	};
}

export default function Calendar({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	const [selectedDay, setSelectedDay] = useState(() => startOfToday());
	const [month, setMonth] = useState(() => startOfMonth(selectedDay));

	const monthDays = eachDayOfInterval({
		start: startOfWeek(month, { weekStartsOn: 1 }),
		end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
	});

	return (
		<main className="flex flex-col w-full items-center h-full mt-2">
			<EventForm
				roles={loaderData.roles}
				files={loaderData.files}
				className="w-fit ml-auto mr-2 mt-2"
			/>
			<div className="xl:w-8/10 w-9/10 mt-2">
				<div className="flex w-full items-center justify-between p-4">
					<FiChevronLeft
						size={21}
						className="cursor-pointer"
						onClick={() => {
							setMonth(addMonths(month, -1));
						}}
					/>
					<div className="text-text font-head font-semibold select-none">
						{format(month, "MMMM yyyy")}
					</div>
					<FiChevronRight
						size={21}
						className="cursor-pointer"
						onClick={() => {
							setMonth(addMonths(month, 1));
						}}
					/>
				</div>
				<div className="mt-2 grid w-full grid-cols-7 place-items-center">
					{days.map((day) => (
						<span key={day} className="text-text2">
							{day}
						</span>
					))}
				</div>
				<div className="mt-1 grid w-full grid-cols-7 bg-border2 border-2 border-border2 gap-0.5 place-items-center">
					{monthDays.map((day) => (
						<div
							key={day.toString()}
							className="group flex pt-1 flex-col items-center w-full sm:h-26 h-22 bg-surface cursor-pointer"
							onClick={() => {
								setSelectedDay(day);
							}}
						>
							<div
								className={`rounded-full w-8 h-8 text-center place-content-center
								${isSameMonth(day, month) || "text-muted"}
								${isSameDay(day, selectedDay) ? "bg-accent text-white" : "group-hover:bg-accent/20"}
								`}
							>
								{format(day, "d")}
							</div>
							<Promisable
								data={loaderData.events}
								skeleton={
									<div className="mt-1 mb-2 w-9/10 h-full flex flex-col gap-0.5 bg-back2 animate-pulse rounded-xl" />
								}
							>
								{(events) => (
									<div className="mt-1 mb-0.75 w-9/10 overflow-y-auto flex flex-col gap-0.5">
										{events
											.filter((ev) =>
												isSameDay(ev.date, day),
											)
											.map((ev) => (
												<Link
													to={`/calendar/${ev.id}`}
													key={ev.id}
													className={`text-xs px-1 w-full font-light text-white rounded-xs hover:bg-accent/90
												${ev.size === ev.registeredCount ? "bg-muted" : "bg-accent"}`}
												>
													{ev.name}
												</Link>
											))}
									</div>
								)}
							</Promisable>
						</div>
					))}
				</div>
			</div>
			<EventList
				events={loaderData.events.then((data) =>
					data.filter((ev) => isSameDay(ev.date, selectedDay)),
				)}
			></EventList>
		</main>
	);
}
