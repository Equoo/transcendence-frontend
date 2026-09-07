import { data } from "react-router";
import type { Route } from "../../routes/+types/admin_users";
import { handleDisconnect } from "../api/users";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({ request }: Route.ClientActionArgs) {
	let res;
	const datas = await request.formData();

	if (request.method === "DELETE") {
		res = await handleDisconnect(datas.get("id") as string);
	}

	return data(res, { status: 201 });
}
