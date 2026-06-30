import { useState, type JSX } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
	format,
	addMonths,
	startOfToday,
	startOfMonth,
	startOfWeek,
	endOfWeek,
	endOfMonth,
	eachDayOfInterval,
	isSameMonth,
	isSameDay,
} from "date-fns";
import { fetchEvents, type EventData } from "../models/events";
import type { Route } from "./+types/calendar";
import { Form, Link } from "react-router";
import EventList from "../components/Events/EventList";
import CheckButton from "../components/CheckButton";
import { PiPlusBold } from "react-icons/pi";
import EventForm from "../components/Events/EventForm";

export async function clientLoader(): Promise<EventData[]> {
	return fetchEvents();
}

export default function Calendar({
	loaderData: events,
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
			<EventForm />
			<div className="xl:w-8/10 w-9/10 mt-2">
				<Form className="w-fit ml-auto">
					<CheckButton
						type="submit"
						active
						activeCheck={false}
						name="eventForm"
					>
						<PiPlusBold />
						Event
					</CheckButton>
				</Form>
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
					{monthDays.map((day, idx) => (
						<div
							key={idx}
							className="group flex pt-1 flex-col items-center w-full sm:h-26 h-22 bg-back cursor-pointer"
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
							<div className="mt-1 mb-0.75 w-9/10 overflow-y-auto flex flex-col gap-0.5">
								{events
									.filter((ev) => isSameDay(ev.date, day))
									.map((ev) => (
										<Link
											to={`/calendar/${ev.id}`}
											key={ev.id}
											className="text-xs px-1 w-full font-light bg-accent text-white rounded-xs hover:bg-accent/90"
										>
											{ev.name}
										</Link>
									))}
							</div>
						</div>
					))}
				</div>
			</div>
			<EventList
				events={events.filter((ev) => isSameDay(ev.date, selectedDay))}
			></EventList>
		</main>
	);
}
