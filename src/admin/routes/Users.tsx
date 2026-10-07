import type { JSX } from "react";

import Promisable from "@/components/Promisable";
import {
	fetchInvitations,
	type Invitation,
} from "@/invitations/api/invitations.api";
import InvitationPromisable from "@/invitations/components/InvitationPromisable";

import { fetchUsers, type User, UserContext } from "../../users/api/users";
import { fetchRoles, type Role } from "../api/roles";
import UserTable from "../components/UserTable";
import type { Route } from "./+types/Users";

let cachedUsers: User[] = [];
let cachedRoles: Role[] = [];
let cachedInvitations: Invitation[] = [];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function clientLoader({ context }: Route.ClientLoaderArgs) {
	const previousUsers = cachedUsers;
	const previousRoles = cachedRoles;
	const previousInvitations = cachedInvitations;

	const users = fetchUsers().then((result) => (cachedUsers = result));
	const roles = fetchRoles().then((result) => (cachedRoles = result));
	const invitations = fetchInvitations().then(
		(result) => (cachedInvitations = result),
	);
	const user = context.get(UserContext);

	return {
		user,
		previousUsers,
		users,
		previousRoles,
		roles,
		previousInvitations,
		invitations,
	};
}

export default function AdminUsers({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	const {
		users,
		previousUsers,
		roles,
		previousRoles,
		user,
		previousInvitations,
		invitations,
	} = loaderData;

	return (
		<div className="w-full h-full bg-back">
			<div className="flex justify-center flex-row w-full h-full">
				<div className="flex flex-col w-11/12 my-10">
					<h1 className="text-3xl m-4 font-semibold font-head">
						User Management
					</h1>
					<Promisable
						data={Promise.all([users, roles])}
						cached_data={[previousUsers, previousRoles]}
					>
						{(data) => (
							<UserTable
								currentUser={user}
								roles={data[1] as Role[]}
								users={data[0] as User[]}
							></UserTable>
						)}
					</Promisable>
					<h1 className="text-3xl ml-4 mb-4 mt-10 font-semibold font-head">
						Invitations Management
					</h1>
					<InvitationPromisable
						className="overflow-y-auto max-h-3/10"
						previousInvitations={previousInvitations}
						invitations={invitations}
					/>
				</div>
			</div>
		</div>
	);
}
