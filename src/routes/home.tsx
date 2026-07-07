import EventForm from "../events/components/EventForm";
import CheckButton from "../components/CheckButton";
import { fetchEvents, type EventData } from "../events/api/events.api";
import type { JSX } from "react";
import { PiPlusBold } from "react-icons/pi";
import { isRouteErrorResponse, useRouteError, Form } from "react-router";
import type { Route } from "./+types/home";
import EventList from "../events/components/EventList";

export async function clientLoader(): Promise<EventData[]> {
	const res = await fetchEvents();

	if (!res.ok) {
		throw res.error;
	}
	return res.events;
}

export default function Home({
	loaderData: events,
}: Route.ComponentProps): JSX.Element {
	return (
		<>
			<div className="w-full flex flex-row px-6 py-4 justify-between items-center">
				<h1 className="font-semibold tracking-tight text-xl">
					Accueil
				</h1>
				<Form>
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
			<EventList events={events} />
			<EventForm />
		</>
	);
}

export function ErrorBoundary(): JSX.Element {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		return (
			<div className="w-full p-6 text-red-500 font-main">
				{error.status} — {error.statusText}
			</div>
		);
	}

	return (
		<div className="w-full p-6 text-red-500 font-main">
			Server error during page loading
		</div>
	);
}
