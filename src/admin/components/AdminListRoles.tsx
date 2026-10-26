/* eslint-disable @eslint-react/no-array-index-key */
import { useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import { TbPencil, TbTrash } from "react-icons/tb";

import { ListCell, ListRow } from "@/components/List/List";
import ChangeModal from "@/components/Modal/ChangeModal";
import ChoiceModal from "@/components/Modal/ChoiceModal";

import { PermEnum, type Role } from "../api/roles";
import { RolesBox } from "./AdminRoleBox";

export interface Perm {
	name: string;
	code: number;
}

export default function ListRoles({ role }: { role: Role }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [showChangeRole, setShowChangeRole] = useState(false);

	const checkboxes: Perm[] = [];

	for (const [key, value] of Object.entries(PermEnum)) {
		if (!isNaN(Number(key))) {
			// eslint-disable-next-line no-continue
			continue;
		}
		checkboxes.push({ name: key, code: value as number });
	}

	return (
		<ListRow className="text-sm text-body border-b rounded-base border-border">
			<ListCell rowHeader className="px-6 font-medium py-5">
				{showChangeRole && (
					<ChangeModal
						title={t("admin.changeRoleName")}
						onClose={() => {
							setShowChangeRole(false);
						}}
						action="/roles/changeRole"
						method="PATCH"
						inputName="name"
						inputLabel={t("common.name")}
						placeholder={t("common.name")}
						minInput={1}
						maxInput={20}
						id={role.id}
					></ChangeModal>
				)}
				{showConfirmation && (
					<ChoiceModal
						title={t("admin.deleteRoleTitle")}
						onClose={() => {
							setShowConfirmation(false);
						}}
						desc={t("admin.deleteRoleDesc")}
						confirmLabel={t("common.delete")}
						action="/roles/deleteRole"
						method="DELETE"
						id={role.id}
					></ChoiceModal>
				)}
				{role.name}
			</ListCell>
			{checkboxes.map((check, index) => (
				<RolesBox role={role} perm={check} key={index}></RolesBox>
			))}
			<ListCell className="flex flex-row items-center justify-between w-full h-full px-6 py-3 ">
				{role.name !== "Member" && (
					<>
						<TbPencil
							size={26}
							className={` text-text2 hover:text-text cursor-pointer hover:animate-rotate`}
							onClick={() => {
								setShowChangeRole(true);
							}}
						/>
						<TbTrash
							size={26}
							className="hover:cursor-pointer text-text2 hover:text-text"
							onClick={() => {
								setShowConfirmation(true);
							}}
						/>
					</>
				)}
			</ListCell>
		</ListRow>
	);
}
