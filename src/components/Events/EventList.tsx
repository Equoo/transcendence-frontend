import type { JSX } from "react";
import EventCard from "./EventCard";
import type { EventData } from "../../models/events";

export default function EventList({
	events,
}: {
	events: EventData[];
}): JSX.Element {
	return (
		<div className="w-full flex px-4 py-8 gap-6 flex-nowrap overflow-auto items-center justify-center-safe">
			{events.map((event) => (
				<EventCard key={event.id} event={event} />
			))}
		</div>
	);
}
