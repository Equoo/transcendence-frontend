import { data } from "react-router";

import { userChangeUsername, userDeleteAccount } from "@/users/api/users.api";

import type { Route } from "../+types/root";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({ request }: Route.ClientLoaderArgs) {
	let res;

	if (request.method === "PATCH") {
		res = await userChangeUsername(await request.formData());
	}
	if (request.method === "DELETE") {
		res = await userDeleteAccount();
	}

	return data(res, { status: 201 });
}
