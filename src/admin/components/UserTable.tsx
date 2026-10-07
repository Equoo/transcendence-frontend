import type { JSX } from "react";

import List from "@/components/List/List";
import type { User } from "@/users/api/users";

import type { Role } from "../api/roles";
import ListUsers from "./AdminListUser";

export default function UserTable({
	users,
	roles,
	currentUser,
}: {
	users: User[];
	roles: Role[] | Promise<Role[]>;
	currentUser: User;
}): JSX.Element {
	return (
		<List
			cols={[
				{ id: "Picture" },
				{ id: "Username" },
				{ id: "Role" },
				{ id: "Action" },
			]}
			empty={users.length === 0}
			emptyMessage="No user to display."
		>
			{users.map((usr) => (
				<ListUsers
					key={usr.id}
					user={usr}
					roles={roles}
					currentUser={currentUser}
				></ListUsers>
			))}
		</List>
	);
}
