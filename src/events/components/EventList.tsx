import type { JSX } from "react";

import Promisable from "@/components/Promisable";

import type { EventSummary } from "../api/events.api";
import EventCard from "./EventCard";

function EventCardSkeleton(): JSX.Element {
	return (
		<div className="@container bg-surface flex w-full max-w-md shrink-0 flex-col gap-4 overflow-hidden border border-border rounded-3xl p-5 shadow-main sm:p-8 animate-pulse">
			<div className="h-lh text-2xl @sm:text-3xl leading-tight">
				<div className="h-[0.8lh] w-3/4 rounded-lg bg-border" />
			</div>
			<div className="flex flex-col gap-3">
				<div className="flex flex-col gap-2">
					<div className="h-5 w-32 rounded bg-border" />
					<div className="h-5 w-44 rounded bg-border" />
				</div>
				<div className="flex h-6 items-center gap-2">
					<div className="h-6 w-16 rounded-full bg-border" />
					<div className="h-6 w-12 rounded-full bg-border" />
				</div>
			</div>
			<div className="mt-auto flex gap-3 items-end border-t border-border pt-4">
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
		<div className=" w-full flex shrink-0 px-4 py-6 gap-6 overflow-x-scroll items-stretch justify-center-safe">
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
	events: Promise<EventSummary[]> | EventSummary[];
	skeletonCount?: number;
}): JSX.Element {
	return (
		<div className=" w-full flex shrink-0 px-4 py-6 gap-6 overflow-x-scroll items-stretch justify-center-safe">
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
