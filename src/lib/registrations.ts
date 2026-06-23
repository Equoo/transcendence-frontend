import type { User } from "./users";

export interface Registration {
	user: User;
	registeredAt: string;
	role?: string;
}

export interface RegistrationInput {
	eventId: string;
	role?: string;
}

export type RegistrationActionResult =
	| { ok: true }
	| { ok: false; error: string };

export async function registerToEvent(
	reg: RegistrationInput,
): Promise<RegistrationActionResult> {
	const res = await fetch(`/api/events/${reg.eventId}/registration`, {
		method: "POST",
	});

	if (!res.ok) {
		return { ok: false, error: (await res.text()) };
	}
	return { ok: true };
}

export async function unregisterToEvent(
	reg: RegistrationInput,
): Promise<RegistrationActionResult> {
	const res = await fetch(`/api/events/${reg.eventId}/registration`, {
		method: "DELETE",
	});

	if (!res.ok) {
		return { ok: false, error: await res.text() };
	}
	return { ok: true };
}
