import type { ProblemDetail } from "./problem_detail";

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

export async function getEventRoles(): Promise<EventRole[]> {
	const res = await fetch(`/api/events/roles`);

	return (await res.json()) as EventRole[];
}
