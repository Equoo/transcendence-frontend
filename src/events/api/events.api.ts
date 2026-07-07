import type { EventRole } from "./event_roles.api";
import type { ProblemDetail } from "../../api/problem_detail";
import type { Registration } from "./registrations.api";
import type { User } from "../../api/users";

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
}

export interface EventInput {
	name: string;
	date: string;
	size: number;
	location: string;
	tags: string[];
	eventRoleIds: string[];
	description: string;
}

export type EventResult =
	| { ok: true; event: EventData }
	| { ok: false; error: ProblemDetail };

export type EventsResult =
	| { ok: true; events: EventData[] }
	| { ok: false; error: ProblemDetail };

export function toEventInput(formData: FormData): EventInput {
	return {
		name: formData.get("name") as string,
		date: formData.get("date") as string,
		size: Number(formData.get("size")),
		location: formData.get("location") as string,
		tags: formData.getAll("tags") as string[],
		eventRoleIds: formData.getAll("roles") as string[],
		description: formData.get("description") as string,
	};
}

export async function fetchEvents(): Promise<EventsResult> {
	const response = await fetch("/api/events");
	if (!response.ok) {
		return { ok: false, error: (await response.json()) as ProblemDetail };
	}

	const events = (await response.json()) as EventData[];
	events.sort((evA, evB) => evA.date.localeCompare(evB.date));
	return { ok: true, events };
}

export async function fetchEvent(id: string): Promise<EventResult> {
	const response = await fetch(`/api/events/${id}`);
	if (!response.ok) {
		return { ok: false, error: (await response.json()) as ProblemDetail };
	}
	return {
		ok: true,
		event: (await response.json()) as EventData,
	};
}

export async function createEvent(event: EventInput): Promise<EventResult> {
	const response = await fetch("/api/events", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(event),
	});

	if (!response.ok) {
		return {
			ok: false,
			error: (await response.json()) as ProblemDetail,
		};
	}

	return {
		ok: true,
		event: (await response.json()) as EventData,
	};
}
