import { APIError, type ProblemDetail } from "../../api/problem_detail";
import type { AppFile } from "../../files/api/files.api";
import type { User } from "../../users/api/users.api";
import type { EventRole } from "./event_roles.api";
import type { Registration } from "./registrations.api";

export interface EventData {
	id: string;
	name: string;
	date: string;
	size: number;
	location: string;
	tags: string[];
	description?: string;
	organizer: User;
	eventRoles: EventRole[];
	registrations: Registration[];
	files: AppFile[];
	registeredCount: number;
	isRegistered: boolean;
}

export interface EventSummary {
	id: string;
	name: string;
	date: string;
	size: number;
	location: string;
	tags: string[];
	eventRoles: EventRole[];
	registeredCount: number;
	isRegistered: boolean;
}

export interface EventInput {
	name: string;
	date: string;
	size: number;
	location: string;
	tags: string[];
	eventRoleIds: string[];
	fileKeys: string[];
	description: string;
}

export function toEventInput(formData: FormData): EventInput {
	return {
		name: formData.get("Name") as string,
		date: formData.get("Date") as string,
		size: Number(formData.get("Size")),
		location: formData.get("Location") as string,
		tags: formData.getAll("Tags") as string[],
		eventRoleIds: formData.getAll("Roles") as string[],
		fileKeys: formData.getAll("Files") as string[],
		description: formData.get("Description") as string,
	};
}

export async function fetchEvents(): Promise<EventSummary[]> {
	const response = await fetch("/api/events");
	if (!response.ok) {
		throw new APIError((await response.json()) as ProblemDetail);
	}

	const events = (await response.json()) as EventSummary[];
	events.sort((evA, evB) => evA.date.localeCompare(evB.date));
	return events;
}

export async function fetchEvent(id: string): Promise<EventData> {
	const res = await fetch(`/api/events/${id}`);
	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
	return (await res.json()) as EventData;
}

export async function createEvent(event: EventInput): Promise<EventData> {
	const res = await fetch("/api/events", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(event),
	});

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}

	return (await res.json()) as EventData;
}
