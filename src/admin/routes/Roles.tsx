/* eslint-disable id-length */
import { type JSX, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";

import ChangeModal from "@/components/Modal/ChangeModal";
import Promisable from "@/components/Promisable";

import CheckButton from "../../components/Button/CheckButton";
import { fetchRoles, type Role } from "../api/roles";
import RoleTable from "../components/RoleTable";
import type { Route } from "./+types/Roles";

let cachedRoles: Role[] | undefined;

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

	const fetcher = useFetcher();
	const roles: Promise<Role[]> | Role[] = loaderData.roles;

	useEffect(() => {
		if (fetcher.data) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowRoleForm(false);
		}
	}, [fetcher.data]);

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
					fetcher={fetcher}
				></ChangeModal>
			)}
			<div className="flex w-full h-full justify-center bg-back">
				<div className="w-11/12 my-10">
					<div className="flex justify-between items-center w-full ">
						<h1 className="text-3xl m-4 font-semibold font-head">
							{t("admin.rolesManagement")}
						</h1>

						<CheckButton
							type="button"
							onClick={() => {
								setShowRoleForm(true);
							}}
							activeCheck={false}
							active
						>
							{t("admin.addRole")}
						</CheckButton>
					</div>
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
