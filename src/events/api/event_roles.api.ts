import type { ProblemDetail } from "../../api/problem_detail";

export interface EventRole {
	id: string;
	name: string;
}

export interface EventRoleInput {
	name: string;
}

export type EventRoleResult =
	| { ok: true; role: EventRole }
	| { ok: false; error: ProblemDetail };

export type EventRolesResult =
	| { ok: true; roles: EventRole[] }
	| { ok: false; error: ProblemDetail };

export async function createEventRole(
	reg: EventRoleInput,
): Promise<EventRoleResult> {
	const res = await fetch(`/api/events/roles`, {
		method: "POST",
		body: JSON.stringify(reg),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		return { ok: false, error: (await res.json()) as ProblemDetail };
	}
	return { ok: true, role: (await res.json()) as EventRole };
}

export async function fetchEventRoles(): Promise<EventRolesResult> {
	const res = await fetch(`/api/events/roles`);

	if (!res.ok) {
		return { ok: false, error: (await res.json()) as ProblemDetail };
	}
	return { ok: true, roles: (await res.json()) as EventRole[] };
}
