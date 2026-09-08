import { data } from "react-router";
import type { Route } from "../../routes/+types/admin_roles";
import { handleCheckbox } from "../api/roles";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({ request }: Route.ClientActionArgs) {
	let res;

	const datas = await request.formData();

	if (request.method === "PATCH") {
		res = await handleCheckbox(
			datas.get("IsChecked") as string,
			datas.get("RoleId") as string,
			Number(datas.get("RolePerm")),
			Number(datas.get("CheckPerm")),
		);
	}

	return data(res, { status: 201 });
}
