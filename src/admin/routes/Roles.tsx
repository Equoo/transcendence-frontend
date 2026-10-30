/* eslint-disable id-length */
import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiComputerTower, PiPlusBold } from "react-icons/pi";

import ChangeModal from "@/components/Modal/ChangeModal";
import Promisable from "@/components/Promisable";
import { HEADER_PADDING } from "@/friends/components/BackToList";

import CheckButton from "../../components/Button/CheckButton";
import { fetchRoles, type Role } from "../api/roles";
import RoleTable from "../components/RoleTable";
import type { Route } from "./+types/Roles";

let cachedRoles: Role[] = [];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function clientLoader() {
	const previousRole = cachedRoles;

	const roles = fetchRoles().then((result) => (cachedRoles = result));

	return { roles, previousRole };
}

export default function AdminRoles({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	const { t } = useTranslation();
	const [showRoleForm, setShowRoleForm] = useState<boolean>(false);

	const roles: Promise<Role[]> | Role[] = loaderData.roles;

	return (
		<>
			{showRoleForm && (
				<ChangeModal
					title={t("admin.createRole")}
					onClose={() => {
						setShowRoleForm(false);
					}}
					action="/roles/createRole"
					method="POST"
					inputName="name"
					inputLabel={t("common.name")}
					placeholder={t("common.name")}
					minInput={1}
					maxInput={20}
					submitLabel={t("common.create")}
				></ChangeModal>
			)}

			<div className="flex flex-col w-full h-full items-center bg-back">
				<div
					className={`flex flex-none items-center justify-between gap-3 border-b w-full border-border py-3 ${HEADER_PADDING}`}
				>
					<h1 className="font-head font-[650] text-[17px] text-text inline-flex gap-2 items-center">
						<PiComputerTower size={20} className="text-muted" />
						{t("admin.rolesManagement")}
					</h1>
				</div>

				<div className="w-18/20 h-100 mt-10 flex flex-col items-end gap-2">
					<CheckButton
						type="button"
						className="w-25"
						onClick={() => {
							setShowRoleForm(true);
						}}
						activeCheck={false}
						active
					>
						<PiPlusBold />
						{t("admin.addRole")}
					</CheckButton>
					<Promisable
						data={roles}
						skeleton={
							<div className="animate-pulse space-y-2 p-4">
								{Array.from({ length: 5 }, (_, i) => (
									<div
										key={i}
										className="h-10 rounded bg-border"
									/>
								))}
							</div>
						}
						cached_data={loaderData.previousRole}
					>
						{(role) => <RoleTable role={role}></RoleTable>}
					</Promisable>
				</div>
			</div>
		</>
	);
}
