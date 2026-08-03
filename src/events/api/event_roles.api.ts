import type { ProblemDetail } from "../../api/problem_detail";
import type { APIResult } from "../../api/results";

export interface EventRole {
	id: string;
	name: string;
}

export interface EventRoleInput {
	name: string;
}

export async function createEventRole(
	reg: EventRoleInput,
): Promise<APIResult<EventRole>> {
	let res = await fetch(`/api/events/roles`, {
		method: "POST",
		body: JSON.stringify(reg),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		if (res.headers.get("Token-Expired") === "True") {
			console.warn("Using RefreshToken...");
			await fetch("/api/auth/refresh");
			res = await fetch("/api/events/roles");
			return { ok: true, res: (await res.json()) as EventRole };
		}
		return { ok: false, prob: (await res.json()) as ProblemDetail };
	}
	return { ok: true, res: (await res.json()) as EventRole };
}

export async function fetchEventRoles(): Promise<APIResult<EventRole[]>> {
	const res = await fetch(`/api/events/roles`);

	if (!res.ok) {
		return { ok: false, prob: (await res.json()) as ProblemDetail };
	}
	return { ok: true, res: (await res.json()) as EventRole[] };
}
