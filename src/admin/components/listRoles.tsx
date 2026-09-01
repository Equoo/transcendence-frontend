import type { JSX } from "react/jsx-runtime";
import { RolesBox } from "./checkbox";
import type { Role } from "../api/roles";
import { PiTrash } from "react-icons/pi";
import { TbPencil } from "react-icons/tb";
import type React from "react";

export interface Perm {
	name: string;
	code: number;
}

export default function ListRoles({
	role,
	setShowConfirmation,
	setShowChangeRole,
	setRoleId,
}: {
	role: Role;
	setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
	setShowChangeRole: React.Dispatch<React.SetStateAction<boolean>>;
	setRoleId: React.Dispatch<React.SetStateAction<string | null>>;
}): JSX.Element {
	const checkboxes: Perm[] = [
		{ name: "isAdmin", code: 1 },
		{ name: "HandleEvent", code: 2 },
		{ name: "GetUser", code: 4 },
		{ name: "InviteUser", code: 8 },
		{ name: "ChangeUsername", code: 16 },
		{ name: "DeleteUser", code: 32 },
		{ name: "ResetPassword", code: 64 },
		{ name: "HandleChannel", code: 128 },
	];

	return (
		<tr className="text-sm text-body border-b rounded-base border-border">
			<td className="px-6 font-medium py-5">{role.name}</td>
			{checkboxes.map((check) => (
				<RolesBox role={role} perm={check} key={role.id}></RolesBox>
			))}
			<td className="space-x-10 w-10/20  px-6 py-3 font-medium text-center">
				<PiTrash
					size={26}
					color="var(--color-text2)"
					className="hover:cursor-pointer"
					onClick={() => {
						console.warn(role.id);
						setRoleId(role.id);
						setShowConfirmation(true);
					}}
				/>
				<TbPencil
					size={26}
					color="var(--color-text2)"
					className={`cursor-pointer`}
					onClick={() => {
						setRoleId(role.id);
						setShowChangeRole(true);
					}}
				/>
			</td>
		</tr>
	);
}
