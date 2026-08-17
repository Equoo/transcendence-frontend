import { data } from "react-router";
import {
	registerToEvent,
	toRegistrationInput,
	unregisterFromEvent,
} from "../api/registrations.api";
import type { Route } from "./+types/registrations.route";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({
	params,
	request,
}: Route.ClientActionArgs) {
	let res: Response;

	if (request.method === "POST") {
		res = await registerToEvent(
			params.eventId,
			toRegistrationInput(await request.formData()),
		);
	} else {
		res = await unregisterFromEvent(params.eventId);
	}
	return data(res);
}
