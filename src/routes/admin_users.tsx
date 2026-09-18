import type { JSX } from "react";

import { fetchRoles } from "../admin/api/roles";
import ListUsers from "../admin/components/AdminListUser";
import List from "../components/List";
import { fetchUsers, UserContext } from "../users/api/users.api";
import type { Route } from "./+types/admin_users";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientLoader({ context }: Route.LoaderArgs) {
	const users = await fetchUsers();
	const roles = await fetchRoles();
	const user = context.get(UserContext);

	return { users, roles, user };
}

export default function AdminUsers({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	return (
		<div className="w-full h-full bg-back">
			<div className="flex justify-center flex-row w-full h-full">
				<div className="flex flex-col w-11/12 my-10">
					<div className="flex justify-between items-center w-full ">
						<h1 className="text-3xl m-4 font-semibold font-head">
							User Management
						</h1>
					</div>
					<List
						cols={[
							{ id: "Username" },
							{ id: "Role" },
							{ id: "Action" },
						]}
						empty={loaderData.users.length === 0}
						emptyMessage="No user to display."
					>
						{loaderData.users.map((usr) => (
							<ListUsers
								key={usr.id}
								user={usr}
								roles={loaderData.roles}
								currentUser={loaderData.user}
							></ListUsers>
						))}
					</List>
				</div>
			</div>
		</div>
	);
}
