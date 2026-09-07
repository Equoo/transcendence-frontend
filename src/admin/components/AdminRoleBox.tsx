/* eslint-disable no-bitwise */
import type { JSX } from "react";
import type { Perm } from "./AdminListRoles";
import { handleCheckbox, type Role } from "../api/roles";

export function RolesBox({
	role,
	perm,
}: {
	role: Role;
	perm: Perm;
}): JSX.Element {
	return (
		<td className="text-center">
			<input
				type="checkbox"
				defaultChecked={Boolean(perm.code & role.permission)}
				className="text-accent cursor-pointer rounded-sm w-6 h-6 text-2xl hover:bg-gray-50 hover:inset-shadow-2xs focus:ring-0"
				onClick={(box) => {
					void handleCheckbox(box, role, perm);
				}}
			></input>
		</td>
	);
}
