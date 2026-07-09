import type { ProblemDetail } from "../../api/problem_detail";
import type { APIResult } from "../../api/results";
import type { User } from "../../api/users";

export interface Registration {
	user: User;
	registeredAt: string;
	role?: string;
}

export interface RegistrationInput {
	eventRoleId: string;
}

export function toRegistrationInput(formData: FormData): RegistrationInput {
	return {
		eventRoleId: formData.get("eventRoleId") as string,
	};
}

export async function registerToEvent(
	eventId: string,
	reg: RegistrationInput,
): Promise<APIResult<null>> {
	const res = await fetch(`/api/events/${eventId}/registration`, {
		method: "POST",
		body: JSON.stringify(reg),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		return { ok: false, prob: (await res.json()) as ProblemDetail };
	}
	return { ok: true, res: null };
}

export async function unregisterFromEvent(
	eventId: string,
): Promise<APIResult<null>> {
	const res = await fetch(`/api/events/${eventId}/registration`, {
		method: "DELETE",
	});

	if (!res.ok) {
		return { ok: false, prob: (await res.json()) as ProblemDetail };
	}
	return { ok: true, res: null };
}
