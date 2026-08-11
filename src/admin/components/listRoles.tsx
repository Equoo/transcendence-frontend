import type { JSX } from "react/jsx-runtime";
import { Perm, type Role } from "../api/roles";
import { RolesBox } from "./checkbox";

export default function ListRoles({ role }: { role: Role }): JSX.Element {
	return (
		<div className="flex gap-20">
			<div className="w-30">
				<h1>{role.name}</h1>
			</div>
			<RolesBox perm={role.permission} enumPerm={Perm.isAdmin}></RolesBox>
			<RolesBox
				perm={role.permission}
				enumPerm={Perm.HandleEvent}
			></RolesBox>
			<RolesBox
				perm={role.permission}
				enumPerm={Perm.HandleChannel}
			></RolesBox>
		</div>
	);
}
