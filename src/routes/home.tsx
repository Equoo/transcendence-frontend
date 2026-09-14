import type { JSX } from "react";

import { type EventRole, fetchEventRoles } from "../events/api/event_roles.api";
import { type EventSummary, fetchEvents } from "../events/api/events.api";
import EventForm from "../events/components/EventForm";
import EventList from "../events/components/EventList";
import { type AppFile, fetchFiles } from "../files/api/files.api";
import type { Route } from "./+types/home";

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
