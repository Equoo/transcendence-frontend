import { data } from "react-router";

import {
	changeRoleName,
	createRole,
	deleteRole,
	handleCheckbox,
} from "../api/roles";
import type { Route } from "./+types/RolesAction";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({
	request,
	params,
}: Route.ClientActionArgs) {
	const formdata = await request.formData();
	let res;

	if (params.action === "createRole") {
		res = await createRole(formdata);
	}

	if (params.action === "changeRole") {
		res = await changeRoleName(formdata);
	}

	if (params.action === "deleteRole") {
		res = await deleteRole(formdata);
	}

	if (params.action === "checkRole") {
		res = await handleCheckbox(formdata);
	}

	return data(res, { status: 201 });
}
