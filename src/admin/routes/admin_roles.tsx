import type { JSX } from "react";
import { fetchRoles } from "../api/roles";
import List from "../components/list";
import type { Route } from "./+types/admin_users";
import ListRoles from "../components/listRoles";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientLoader() {
	const roles = await fetchRoles();

	return { roles };
}

export default function AdminRoles({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	return (
		<div className="flex w-full h-full justify-center bg-back">
			<div className="w-11/12 my-10">
				<List headers={["Role", "Permissions"]}>
					{loaderData.roles.map((rls) => (
						<ListRoles key={rls.id} role={rls}></ListRoles>
					))}
				</List>
			</div>
		</div>
	);
}
