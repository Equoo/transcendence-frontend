import { request } from "@/api/request";

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
	return request(`/api/events/${eventId}/registration`, "POST", reg);
}

export async function unregisterFromEvent(eventId: string): Promise<Response> {
	return request(`/api/events/${eventId}/registration`, "DELETE");
}
