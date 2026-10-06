import callApi from "@/tokens/callApi";

import { APIError, type ProblemDetail } from "../../api/problem_detail";
import type { User } from "../../users/api/users";

export interface Registration {
	user: User;
	registeredAt: string;
	role: string;
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
): Promise<Response> {
	const res = await callApi(`/api/events/${eventId}/registration`, {
		method: "POST",
		body: JSON.stringify(reg),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
	return res;
}

export async function unregisterFromEvent(eventId: string): Promise<Response> {
	const res = await callApi(`/api/events/${eventId}/registration`, {
		method: "DELETE",
	});

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
	return res;
}
