import {
	ListRow,
	ListCell,
	ListActions,
	ListAction,
} from "../../components/List";
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
		<ListRow>
			<ListCell rowHeader>{role.name}</ListCell>
			{checkboxes.map((check) => (
				<RolesBox role={role} perm={check} key={check.code}></RolesBox>
			))}
			<ListCell>
				{role.name !== "Member" && (
					<ListActions>
						<ListAction
							onClick={() => {
								setRoleId(role.id);
								setShowConfirmation(true);
							}}
						>
							<PiTrash size={22} />
						</ListAction>
						<ListAction
							onClick={() => {
								setRoleId(role.id);
								setShowChangeRole(true);
							}}
						>
							<TbPencil size={22} />
						</ListAction>
					</ListActions>
				)}
			</ListCell>
		</ListRow>
	);
}
