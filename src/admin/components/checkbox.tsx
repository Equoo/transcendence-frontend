/* eslint-disable no-bitwise */
import type { JSX } from "react";
import type { Perm } from "./listRoles";
import type React from "react";
import type { Role } from "../api/roles";

export default function AdminBox({
	name,
	value,
}: {
	name: string;
	value: number;
}): JSX.Element {
	return (
		<div className="flex gap-5 items-center">
			<h1 className="text-2xl">{name}</h1>
			<input
				className="w-5 h-5"
				type="checkbox"
				value={value}
				name={name}
			></input>
		</div>
	);
}

async function handleCheckbox(
	box: React.MouseEvent<HTMLInputElement>,
	role: Role,
	perm: Perm,
): Promise<void> {
	let finalCode;

	if (box.currentTarget.checked) {
		// eslint-disable-next-line no-multi-assign
		finalCode = role.permission += perm.code;
	} else {
		// eslint-disable-next-line no-multi-assign
		finalCode = role.permission -= perm.code;
	}

	
}

export function RolesBox({
	role,
	perm,
}: {
	role: Role;
	perm: Perm;
}): JSX.Element {
	return (
		<div className="flex flex-col items-center w-30">
			<p>{perm.name}</p>
			<input
				type="checkbox"
				defaultChecked={Boolean(perm.code & role.permission)}
				className="text-accent cursor-pointer"
				onClick={(box) => {
					handleCheckbox(box, role, perm);
				}}
			></input>
		</div>
	);
}
