/* eslint-disable no-bitwise */
import type { JSX } from "react";
import type { Perm } from "./AdminListRoles";
import type { Role } from "../api/roles";
import { useFetcher } from "react-router";

export function RolesBox({
	role,
	perm,
}: {
	role: Role;
	perm: Perm;
}): JSX.Element {
	const fetcher = useFetcher();

	return (
		<td className="text-center">
			<input
				type="checkbox"
				defaultChecked={Boolean(perm.code & role.permission)}
				className="text-accent cursor-pointer rounded-sm w-6 h-6 text-2xl hover:bg-gray-50 hover:inset-shadow-2xs focus:ring-0"
				onClick={(box) => {
					void fetcher.submit(
						{
							RoleId: role.id,
							RolePerm: role.permission,
							CheckPerm: perm.code,
							IsChecked: box.currentTarget.checked,
						},
						{ method: "PATCH", action: "/roles/check" },
					);
				}}
			></input>
		</td>
	);
}
