import type { Route } from "./+types/events.route";
import {
	createEvent,
	deleteEvent,
	toEventInput,
	updateEvent,
} from "../api/events.api";
import { data } from "react-router";
import {
	createEventRole,
	fetchEventRoles,
	type EventRole,
} from "../api/event_roles.api";

async function upsertRoleIds(
	roles: EventRole[],
	names: string[],
): Promise<string[]> {
	const rolesId = [];
	const promises = [];

	for (const el of names) {
		const role = roles.find((ro) => ro.name === el);

		if (role) {
			rolesId.push(role.id);
		} else {
			promises.push(createEventRole({ name: el }));
		}
	}
	const results = await Promise.all(promises);
	for (const res of results) {
		rolesId.push(res.id);
	}
	return rolesId;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({
	request,
	params,
}: Route.ClientActionArgs) {
	let res;

	if (request.method === "DELETE") {
		if (!params.eventId) {
			throw new Error("Event ID is required for deletion");
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		res = await deleteEvent(params.eventId);
		return data(res);
	}
	const event = toEventInput(await request.formData());
	const rolesPromise = fetchEventRoles();
	const roles = await rolesPromise;

	event.eventRoleIds = await upsertRoleIds(roles, event.eventRoleIds);

	if (request.method === "POST") {
		res = await createEvent(event);
	} else if (request.method === "PUT") {
		if (!params.eventId) {
			throw new Error("Event ID is required for update");
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		res = await updateEvent(event, params.eventId);
	}

	return data(res);
}
