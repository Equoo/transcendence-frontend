import { data } from "react-router";

import { handleChange, handleDisconnect } from "../api/users";
import type { Route } from "./+types/admin.user.routeDisconnect";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({ request }: Route.ClientActionArgs) {
	let res;
	const datas = await request.formData();

	if (request.method === "DELETE") {
		res = await handleDisconnect(datas.get("id") as string);
	}
	if (request.method === "PATCH") {
		res = await handleChange(
			datas.get("UserId") as string,
			datas.get("RoleId") as string,
		);
	}

	return data(res, { status: 201 });
}
