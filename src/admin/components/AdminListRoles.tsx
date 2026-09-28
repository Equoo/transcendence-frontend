/* eslint-disable @eslint-react/no-array-index-key */
import { useEffect, useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { TbPencil, TbTrash } from "react-icons/tb";
import { useFetcher } from "react-router";

import ChangeModal from "@/components/Modal/ChangeModal";
import ChoiceModal from "@/components/Modal/ChoiceModal";

import { PermEnum, type Role } from "../api/roles";
import { RolesBox } from "./AdminRoleBox";

export interface Perm {
	name: string;
	code: number;
}

export default function ListRoles({ role }: { role: Role }): JSX.Element {
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [showChangeRole, setShowChangeRole] = useState(false);

	const fetcher = useFetcher();

	useEffect(() => {
		if (fetcher.data) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowConfirmation(false);
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowChangeRole(false);
		}
	}, [fetcher.data]);

	const checkboxes: Perm[] = [];

	for (const [key, value] of Object.entries(PermEnum)) {
		if (!isNaN(Number(key))) {
			// eslint-disable-next-line no-continue
			continue;
		}
		checkboxes.push({ name: key, code: value as number });
	}

	return (
		<tr className="text-sm text-body border-b rounded-base border-border h-full">
			<td className="px-6 font-medium py-5">
				{showChangeRole && (
					<ChangeModal
						title="Change role's name"
						onClose={() => {
							setShowChangeRole(false);
						}}
						action="/roles/changeRole"
						method="PATCH"
						inputName="name"
						placeholder="name"
						minInput={1}
						maxInput={20}
						fetcher={fetcher}
						id={role.id}
					></ChangeModal>
				)}
				{showConfirmation && (
					<ChoiceModal
						title={`Delete your role ?`}
						onClose={() => {
							setShowConfirmation(false);
						}}
						desc="All users using this role will become member instead. This cannot be cancelled."
						action="/roles/deleteRole"
						method="DELETE"
						fetcher={fetcher}
						id={role.id}
					></ChoiceModal>
				)}
				{role.name}
			</td>
			{checkboxes.map((check, index) => (
				<RolesBox role={role} perm={check} key={index}></RolesBox>
			))}
			<td className="flex flex-row items-center justify-between w-full h-full px-6 py-3 ">
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
			</td>
		</tr>
	);
}
