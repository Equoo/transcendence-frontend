import { createEventRole, getEventRoles, type EventRole } from "./event_roles";
import type { ProblemDetail } from "./problem_detail";
import type { Registration } from "./registrations";
import type { User } from "./users";

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
	eventRolesId: string[];
	description: string;
}

export type EventActionResult =
	| { ok: true; event: EventData }
	| { ok: false; error: ProblemDetail };

function splitList(list: string): string[] {
	if (!list.trim()) {
		return [];
	}
	return list.trim().split(/\s+/u);
}

function toEventInput(formData: FormData): EventInput {
	return {
		name: formData.get("name") as string,
		date: formData.get("date") as string,
		size: Number(formData.get("size")),
		location: formData.get("location") as string,
		tags: splitList(formData.get("tags") as string),
		eventRolesId: splitList(formData.get("roles") as string),
		description: formData.get("description") as string,
	};
}

export async function fetchEvents(): Promise<EventData[]> {
	const response = await fetch("/api/events");
	if (!response.ok) {
		throw new Error("Can't fetch events");
	}

	const events = (await response.json()) as EventData[];
	events.sort((evA, evB) => Number(evA.date > evB.date));
	return events;
}

export async function fetchEvent(id: string): Promise<EventActionResult> {
	const response = await fetch(`/api/events/${id}`);
	if (!response.ok) {
		return { ok: false, error: (await response.json()) as ProblemDetail };
	}
	return {
		ok: true,
		event: (await response.json()) as EventData,
	};
}

export async function createEvent(
	formData: FormData,
): Promise<EventActionResult> {
	const object = toEventInput(formData);
	const roles = await getEventRoles();
	const rolesId = [];

	const promises = [];
	for (const el of object.eventRolesId) {
		const role = roles.find((ro) => ro.name === el);

		if (role) {
			rolesId.push(role.id);
		} else {
			promises.push(createEventRole({ name: el }));
		}
	}
	const results = await Promise.all(promises);
	for (const res of results) {
		if (!res.ok) {
			return {
				ok: false,
				error: res.error,
			};
		}
		rolesId.push(res.role.id);
	}
	object.eventRolesId = rolesId;
	const response = await fetch("/api/events", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(object),
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
