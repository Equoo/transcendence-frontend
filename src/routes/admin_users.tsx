import { fetchUsers } from "../admin/api/users";
import ListUsers from "../admin/components/AdminListUser";
import { PiMagnifyingGlass } from "react-icons/pi";
import { fetchRoles } from "../admin/api/roles";
import List from "../components/List";
import type { JSX } from "react";
import type { Route } from "./+types/admin_users";
import { UserContext } from "../users/api/users.api";

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
			<div className="flex justify-center flex-row gap-10 w-full h-full">
				<div className="flex flex-col gap-10 w-11/12 my-10">
					<div className="flex justify-between items-center w-full ">
						<h1 className="text-3xl m-4 font-semibold font-head">
							User Management
						</h1>
						<div className="flex h-10 bg-white border-2 border-border  rounded-md justify-center items-center">
							<input
								className="w-15/16 pl-2.5"
								placeholder="Search User"
							></input>
							<PiMagnifyingGlass className="m-5 size-5"></PiMagnifyingGlass>
						</div>
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
