import { data } from "react-router";
import {
	registerToEvent,
	toRegistrationInput,
	unregisterFromEvent,
} from "../api/registrations.api";
import type { Route } from "./+types/registrations.route";
import { APIError } from "../../api/problem_detail";
import type { APIResult } from "../../api/results";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({
	params,
	request,
}: Route.ClientActionArgs) {
	let res: APIResult<null>;

	if (request.method === "POST") {
		res = await registerToEvent(
			params.eventId,
			toRegistrationInput(await request.formData()),
		);
	} else {
		res = await unregisterFromEvent(params.eventId);
	}
	if (!res.ok) {
		throw new APIError(res.prob);
	}
	return data(res.res, { status: 201 });
}
