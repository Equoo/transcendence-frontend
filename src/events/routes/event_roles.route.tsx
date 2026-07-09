import { APIError } from "../../api/problem_detail";
import { fetchEventRoles } from "../api/event_roles.api";
import { data } from "react-router";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientLoader() {
	const res = await fetchEventRoles();

	if (!res.ok) {
		throw new APIError(res.error);
	}
	return data(res.roles);
}
