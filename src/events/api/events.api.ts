import type { EventRole } from "./event_roles.api";
import type { ProblemDetail } from "../../api/problem_detail";
import type { Registration } from "./registrations.api";
import type { User } from "../../api/users";
import type { APIResult } from "../../api/results";

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

export function toEventInput(formData: FormData): EventInput {
	return {
		name: formData.get("Name") as string,
		date: formData.get("Date") as string,
		size: Number(formData.get("Size")),
		location: formData.get("Location") as string,
		tags: formData.getAll("Tags") as string[],
		eventRoleIds: formData.getAll("Roles") as string[],
		description: formData.get("Description") as string,
	};
}

export async function fetchEvents(): Promise<APIResult<EventData[]>> {
	const response = await fetch("/api/events");
	if (!response.ok) {
		return { ok: false, prob: (await response.json()) as ProblemDetail };
	}

	const events = (await response.json()) as EventData[];
	events.sort((evA, evB) => evA.date.localeCompare(evB.date));
	return { ok: true, res: events };
}

export async function fetchEvent(id: string): Promise<APIResult<EventData>> {
	const response = await fetch(`/api/events/${id}`);
	if (!response.ok) {
		return { ok: false, prob: (await response.json()) as ProblemDetail };
	}
	return {
		ok: true,
		res: (await response.json()) as EventData,
	};
}

export async function createEvent(
	event: EventInput,
): Promise<APIResult<EventData>> {
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
			prob: (await response.json()) as ProblemDetail,
		};
	}

	return {
		ok: true,
		res: (await response.json()) as EventData,
	};
}
