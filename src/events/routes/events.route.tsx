import type { Route } from "./+types/events.route";
import { createEvent, toEventInput } from "../api/events.api";
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
export async function clientAction({ request }: Route.ClientActionArgs) {
	const rolesPromise = fetchEventRoles();
	const event = toEventInput(await request.formData());
	const roles = await rolesPromise;

	event.eventRoleIds = await upsertRoleIds(roles, event.eventRoleIds);
	const res = await createEvent(event);

	return data(res, { status: 201 });
}
