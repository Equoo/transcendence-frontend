import { fetchEvents, type EventData } from "../events/api/events.api";
import type { JSX } from "react";
import { isRouteErrorResponse } from "react-router";
import { APIError } from "../api/problem_detail";
import type { Route } from "./+types/home";
import EventList from "../events/components/EventList";
import EventForm from "../events/components/EventForm";
import { fetchEventRoles, type EventRole } from "../events/api/event_roles.api";
import { fetchFiles, type AppFile } from "../files/api/files.api";

export function clientLoader(): {
	events: Promise<EventData[]>;
	roles: Promise<EventRole[]>;
	files: Promise<AppFile[]>;
} {
	return {
		events: fetchEvents(),
		roles: fetchEventRoles(),
		files: fetchFiles(),
	};
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
				<EventForm roles={loaderData.roles} files={loaderData.files} />
			</div>
			<EventList events={loaderData.events} />
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
