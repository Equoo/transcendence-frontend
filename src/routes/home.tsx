import EventCard from "../components/Events/EventCard";
import EventForm from "../components/Events/EventForm";
import CheckButton from "../components/CheckButton";
import { createEvent, fetchEvents, type EventData } from "../lib/events";
import { useState, type JSX } from "react";
import { PiPlusBold } from "react-icons/pi";
import { isRouteErrorResponse, useRouteError } from "react-router";
import type { Route } from "./+types/home";

export async function clientLoader({}: Route.ClientLoaderArgs): Promise<
	EventData[]
> {
	return fetchEvents();
}

export async function clientAction({ request }: Route.ClientActionArgs) {
	return createEvent(await request.formData());
}

export default function Home({
	loaderData: events,
}: Route.ComponentProps): JSX.Element {
	const [showEventForm, setShowEventForm] = useState(false);

	return (
		<>
			<div className="w-full flex flex-row px-6 py-4 justify-between items-center">
				<h1 className="font-semibold tracking-tight text-xl">
					Accueil
				</h1>
				<CheckButton
					active
					activeCheck={false}
					onClick={() => {
						setShowEventForm(true);
					}}
				>
					<PiPlusBold />
					Event
				</CheckButton>
			</div>
			<div className="w-full flex px-4 py-8 gap-8 flex-nowrap overflow-auto">
				{events.map((event) => (
					<EventCard key={event.id} event={event} />
				))}
			</div>

			{showEventForm ? (
				<EventForm
					isOpen={showEventForm}
					onClose={() => {
						setShowEventForm(false);
					}}
				/>
			) : null}
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
			Impossible de charger les événements.
		</div>
	);
}
