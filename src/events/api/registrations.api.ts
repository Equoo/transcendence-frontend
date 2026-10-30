import { APIError, type ProblemDetail } from "@/api/problem_detail";
import { request } from "@/api/request";
import callApi from "@/tokens/callApi";

import type { User } from "../../users/api/users";

export interface Registration {
	user: User;
	registeredAt: string;
	role: string;
}

export interface RegistrationInput {
	eventRoleId: string;
}

export interface PatchRegistrationInput {
	eventRoleId: string;
	userId: string;
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
	return request(`/api/events/${eventId}/registration`, "POST", reg);
}

export async function patchRegistration(
	eventId: string,
	req: PatchRegistrationInput,
): Promise<Response> {
	const res = await callApi(`/api/events/${eventId}/registration`, {
		method: "PATCH",
		body: JSON.stringify(req),
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
	return request(`/api/events/${eventId}/registration`, "DELETE");
}

export async function unregisterUserFromEvent(
	eventId: string,
	userId: string,
): Promise<Response> {
	return request(`/api/events/${eventId}/registration/${userId}`, "DELETE");
}
