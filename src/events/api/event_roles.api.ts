import { APIError, type ProblemDetail } from "../../api/problem_detail";

export interface EventRole {
	id: string;
	name: string;
}

export interface EventRoleInput {
	name: string;
}

export async function createEventRole(reg: EventRoleInput): Promise<EventRole> {
	const res = await fetch(`/api/events/roles`, {
		method: "POST",
		body: JSON.stringify(reg),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
	return (await res.json()) as EventRole;
}

export async function fetchEventRoles(): Promise<EventRole[]> {
	const res = await fetch(`/api/events/roles`);

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
	return (await res.json()) as EventRole[];
}
