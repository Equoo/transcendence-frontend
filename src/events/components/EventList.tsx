import type { JSX } from "react";
import EventCard from "./EventCard";
import type { EventData } from "../api/events.api";

export default function EventList({
	events,
}: {
	events: EventData[];
}): JSX.Element {
	return (
		<div className=" w-full flex shrink-0 px-4 py-6 gap-6 overflow-x-scroll items-center justify-center-safe">
			{events.map((event) => (
				<EventCard key={event.id} event={event} />
			))}
		</div>
	);
}
