import EventForm from "../events/components/EventForm";
import CheckButton from "../components/CheckButton";
import { fetchEvents, type EventData } from "../events/api/events.api";
import { Suspense, type JSX } from "react";
import { PiPlusBold } from "react-icons/pi";
import { isRouteErrorResponse, Form } from "react-router";
import { APIError } from "../api/problem_detail";
import type { Route } from "./+types/home";
import EventList from "../events/components/EventList";
import EventListSkeleton from "../events/components/EventListSkeleton";
import { fetchEventRoles, type EventRole } from "../events/api/event_roles.api";

export function clientLoader(): {
	events: Promise<EventData[]>;
	eventRoles: Promise<EventRole[]>;
} {
	return { events: fetchEvents(), eventRoles: fetchEventRoles() };
}

export default function Home({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	return (
		<>
			<div className="w-full flex flex-row px-6 py-4 justify-between items-center">
				<h1 className="font-semibold tracking-tight text-xl">
					Accueil
				</h1>
				<Form defaultShouldRevalidate={false}>
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
			</div>
			<Suspense fallback={<EventListSkeleton />}>
				<EventList eventsPromise={loaderData.events} />
			</Suspense>
			<Suspense fallback={null}>
				<EventForm rolesPromise={loaderData.eventRoles} />
			</Suspense>
		</>
	);
}

export function ErrorBoundary({
	error,
}: Route.ErrorBoundaryProps): JSX.Element {
	if (isRouteErrorResponse(error)) {
		return (
			<div className="w-full p-6 text-red-500 font-main">
				{error.status} — {error.statusText}
			</div>
		);
	} else if (error instanceof APIError) {
		return (
			<>
				<h1>{error.name}</h1>
				<div className="w-full p-6 text-red-500 font-main">
					{error.message}
				</div>
			</>
		);
	}
	return (
		<div className="w-full p-6 text-red-500 font-main">
			Server error during page loading
		</div>
	);
}
