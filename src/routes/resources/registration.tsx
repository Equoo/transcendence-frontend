import {
	registerToEvent,
	unregisterToEvent,
	type RegistrationActionResult,
} from "../../lib/registrations";
import type { Route } from "./+types/registration";

export async function clientAction({
	params,
	request,
}: Route.ClientActionArgs): Promise<RegistrationActionResult> {
	if (request.method === "POST") {
		return registerToEvent({ eventId: params.eventId });
	}
	return unregisterToEvent({ eventId: params.eventId });
}
