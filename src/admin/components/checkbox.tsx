/* eslint-disable no-bitwise */
import type { JSX } from "react";
import type { Perm } from "./listRoles";
import type React from "react";
import type { Role } from "../api/roles";

function handleCheckbox(
	box: React.MouseEvent<HTMLInputElement>,
	role: Role,
	perm: Perm,
): void {
	let finalCode;

	if (box.currentTarget.checked) {
		// eslint-disable-next-line no-multi-assign
		finalCode = role.permission += perm.code;
	} else {
		// eslint-disable-next-line no-multi-assign
		finalCode = role.permission -= perm.code;
	}
	console.warn(finalCode);
}

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
					handleCheckbox(box, role, perm);
				}}
			></input>
		</td>
	);
}
