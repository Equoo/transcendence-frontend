/* eslint-disable no-bitwise */
import type React from "react";
import type { JSX } from "react";

import { ListCell } from "../../components/List";
import type { Role } from "../api/roles";
import type { Perm } from "./listRoles";

interface PermInput {
	permission: number;
}

function toPermInput(perm: number): PermInput {
	return { permission: perm };
}

async function handleCheckbox(
	box: React.MouseEvent<HTMLInputElement>,
	role: Role,
	perm: Perm,
): Promise<Response> {
	let finalCode: number;

	if (box.currentTarget.checked) {
		// eslint-disable-next-line no-multi-assign
		finalCode = role.permission += perm.code;
	} else {
		// eslint-disable-next-line no-multi-assign
		finalCode = role.permission -= perm.code;
	}

	const res = await fetch(`/api/roles/${role.id}/permission`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(toPermInput(finalCode).permission),
	});

	return res;
}

export function RolesBox({
	role,
	perm,
}: {
	role: Role;
	perm: Perm;
}): JSX.Element {
	return (
		<ListCell pos="text-center">
			<input
				type="checkbox"
				aria-label={`${perm.name} for ${role.name}`}
				defaultChecked={Boolean(perm.code & role.permission)}
				className="text-accent cursor-pointer rounded-sm w-6 h-6 text-2xl hover:bg-gray-50 hover:inset-shadow-2xs focus:ring-0"
				onClick={(box) => {
					void handleCheckbox(box, role, perm);
				}}
			></input>
		</ListCell>
	);
}
