import type { JSX } from "react";
import { useTranslation } from "react-i18next";

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
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	return (
		<List
			cols={[
				{ id: t("admin.picture") },
				{ id: t("profile.username") },
				{ id: t("admin.role") },
				{ id: t("common.actions") },
			]}
			empty={users.length === 0}
			emptyMessage={t("admin.noUser")}
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
