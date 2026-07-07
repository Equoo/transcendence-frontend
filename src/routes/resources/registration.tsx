import {
	registerToEvent,
	toRegistrationInput,
	unregisterFromEvent,
	type RegistrationActionResult,
} from "../../api/registrations";
import type { Route } from "./+types/registration";

export async function clientAction({
	params,
	request,
}: Route.ClientActionArgs): Promise<RegistrationActionResult> {
	if (request.method === "POST") {
		return registerToEvent(
			params.eventId,
			toRegistrationInput(await request.formData()),
		);
	}
	return unregisterFromEvent(params.eventId);
}
