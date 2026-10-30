import type { TFunction } from "i18next";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import List, { type ListColumn } from "@/components/List/List";

import { PermEnum, type Role } from "../api/roles";
import ListRoles from "./AdminListRoles";

// eslint-disable-next-line id-length
function getHeader(t: TFunction): ListColumn[] {
	return [
		{ id: t("common.name") },
		...Object.keys(PermEnum)
			.filter((key) => isNaN(Number(key)))
			.map((key) => ({
				id: t(`permissions.${key}`),
				className:
					"whitespace-normal min-w-32 text-balance align-bottom",
			})),
		{ id: t("common.actions") },
	];
}

export default function RoleTable({ role }: { role: Role[] }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();

	return (
		<List
			cols={getHeader(t)}
			empty={role.length === 0}
			emptyMessage={t("admin.noRole")}
		>
			{role.map((rls) => (
				<ListRoles key={rls.id} role={rls}></ListRoles>
			))}
		</List>
	);
}
