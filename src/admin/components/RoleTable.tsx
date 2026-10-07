import type { JSX } from "react";

import List, { type ListColumn } from "@/components/List/List";

import { PermEnum, type Role } from "../api/roles";
import ListRoles from "./AdminListRoles";

const HEADER: ListColumn[] = [
	{ id: "Name" },
	...Object.keys(PermEnum)
		.filter((key) => isNaN(Number(key)))
		.map((key) => ({ id: key })),
	{ id: "Actions" },
];

export default function RoleTable({ role }: { role: Role[] }): JSX.Element {
	return (
		<List cols={HEADER}>
			{role.map((rls) => (
				<ListRoles key={rls.id} role={rls}></ListRoles>
			))}
		</List>
	);
}
