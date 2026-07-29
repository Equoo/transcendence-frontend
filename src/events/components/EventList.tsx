import type { JSX } from "react";
import EventCard from "./EventCard";
import type { EventData } from "../api/events.api";
import Promisable from "./Promisable";

function EventCardSkeleton(): JSX.Element {
	return (
		<div className="bg-surface flex max-w-lg grow sm:min-w-sm min-w-sm h-fit flex-col gap-4 overflow-hidden border border-border rounded-3xl p-6 shadow-main sm:p-8 animate-pulse">
			<div className="h-8 w-3/4 rounded-lg bg-border" />
			<div className="inline-flex min-h-9 gap-6 justify-between items-start">
				<div className="flex flex-col gap-2">
					<div className="h-4 w-32 rounded bg-border" />
					<div className="h-4 w-44 rounded bg-border" />
				</div>
				<div className="flex flex-nowrap items-center gap-2.5">
					<div className="h-6 w-16 rounded-full bg-border" />
					<div className="h-6 w-12 rounded-full bg-border" />
				</div>
			</div>
			<div className="flex gap-3 items-end">
				<div className="flex flex-col gap-1.5">
					<div className="h-8 w-40 rounded-lg bg-border" />
					<div className="h-3 w-24 rounded bg-border" />
				</div>
				<div className="ml-auto h-6 w-32 rounded-full bg-border" />
			</div>
			<div className="flex gap-2.5 items-center">
				<div className="h-9 w-28 rounded-full bg-border" />
				<div className="ml-auto h-9 w-24 rounded-full bg-border" />
			</div>
		</div>
	);
}

function EventListSkeleton({ count = 3 }: { count?: number }): JSX.Element {
	return (
		<div
			className=" w-full flex shrink-0 px-4 py-6 gap-6 overflow-x-scroll items-center justify-center-safe"
			aria-busy="true"
			aria-live="polite"
			aria-label="Chargement des évènements"
		>
			{Array.from({ length: count }, (___, index) => (
				<EventCardSkeleton key={index} />
			))}
		</div>
	);
}

export default function EventList({
	events,
	skeletonCount = 3,
}: {
	events: Promise<EventData[]> | EventData[];
	skeletonCount?: number;
}): JSX.Element {
	return (
		<div className=" w-full flex shrink-0 px-4 py-6 gap-6 overflow-x-scroll items-center justify-center-safe">
			<Promisable
				data={events}
				skeleton={<EventListSkeleton count={skeletonCount} />}
			>
				{(data) =>
					data.map((event) => (
						<EventCard key={event.id} event={event} />
					))
				}
			</Promisable>
		</div>
	);
}
