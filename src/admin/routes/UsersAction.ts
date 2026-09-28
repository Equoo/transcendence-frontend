import { data } from "react-router";

import {
	handleChange,
	handleDisconnect,
	handleRemoveUser,
	resetPassword,
} from "../api/users";
import type { Route } from "./+types/UsersAction";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({
	request,
	params,
}: Route.ClientActionArgs) {
	const formdata = await request.formData();
	let res;

	if (params.action === "removeUser") {
		res = await handleRemoveUser(formdata);
	}

	if (params.action === "passwordUser") {
		res = await resetPassword(formdata);
	}

	if (params.action === "disconnectUser") {
		res = await handleDisconnect(formdata);
	}

	if (params.action === "roleUser") {
		res = await handleChange(formdata);
	}

	return data(res, { status: 201 });
}
