import { data } from "react-router";
import type { Route } from "../../routes/+types/admin_roles";
import {
	changeRoleName,
	createRole,
	deleteRole,
	toRoleInput,
} from "../api/roles";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({ request }: Route.ClientActionArgs) {
	let res;
	if (request.method === "POST") {
		res = await createRole(toRoleInput(await request.formData()));
	}
	if (request.method === "PATCH") {
		const dataRequest = await request.formData();

		res = await changeRoleName(
			dataRequest.get("id") as string,
			dataRequest.get("name") as string,
		);
	}
	if (request.method === "DELETE") {
		res = await deleteRole((await request.formData()).get("id") as string);
	}

	return data(res, { status: 201 });
}
