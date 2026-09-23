import { data } from "react-router";

import {
	userChangeAvatar,
	userChangePassword,
	userChangeUsername,
	userDeleteAccount,
	userLogout,
} from "../api/users.api";
import type { Route } from "./+types/me";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({
	request,
	params,
}: Route.ClientActionArgs) {
	const formdata = await request.formData();
	let res;

	if (params.action === "avatar") {
		res = await userChangeAvatar(formdata);
	}
	if (params.action === "username") {
		res = await userChangeUsername(formdata);
	}
	if (params.action === "password") {
		res = await userChangePassword(formdata);
	}
	if (params.action === "logout") {
		res = await userLogout();
	}
	if (params.action === "delete") {
		res = await userDeleteAccount();
	}

	return data(res, { status: 200 });
}
