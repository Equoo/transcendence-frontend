import type { JSX } from "react";

import { fetchInvitations } from "@/invitations/api/invitations.api";
import InvitationList from "@/invitations/components/InvitationList";

import { fetchRoles } from "../admin/api/roles";
import ListUsers from "../admin/components/AdminListUser";
import List from "../components/List";
import { fetchUsers, UserContext } from "../users/api/users.api";
import type { Route } from "./+types/admin_users";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientLoader({ context }: Route.ClientLoaderArgs) {
	const users = await fetchUsers();
	const roles = await fetchRoles();
	const user = context.get(UserContext);

	return { users, roles, user, invitations: fetchInvitations() };
}

export default function AdminUsers({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	return (
		<div className="w-full h-full bg-back">
			<div className="flex justify-center flex-row w-full h-full">
				<div className="flex flex-col w-11/12 my-10">
					<h1 className="text-3xl m-4 font-semibold font-head">
						User Management
					</h1>
					<List
						cols={[
							{ id: "Picture" },
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
					<h1 className="text-3xl ml-4 mb-4 mt-10 font-semibold font-head">
						Invitations Management
					</h1>
					<InvitationList
						className="overflow-y-auto max-h-3/10"
						invitations={loaderData.invitations}
					/>
				</div>
			</div>
		</div>
	);
}
