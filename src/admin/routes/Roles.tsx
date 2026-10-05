import { type JSX, useEffect, useState } from "react";
import { useFetcher } from "react-router";

import ChangeModal from "@/components/Modal/ChangeModal";

import CheckButton from "../../components/Button/CheckButton";
import List, { type ListColumn } from "../../components/List/List";
import { fetchRoles, PermEnum } from "../api/roles";
import ListRoles from "../components/AdminListRoles";
import type { Route } from "./+types/Roles";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientLoader() {
	const roles = await fetchRoles();

	return { roles };
}

export default function AdminRoles({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	const [showRoleForm, setShowRoleForm] = useState<boolean>(false);

	const fetcher = useFetcher();

	useEffect(() => {
		if (fetcher.data) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowRoleForm(false);
		}
	}, [fetcher.data]);

	const headers: ListColumn[] = [];

	headers.push({ id: "Name" });

	for (const key in PermEnum) {
		if (!isNaN(Number(key))) {
			// eslint-disable-next-line no-continue
			continue;
		}
		const col = { id: key } as ListColumn;
		headers.push(col);
	}

	headers.push({ id: "Action" });

	return (
		<>
			{showRoleForm && (
				<ChangeModal
					title="Create Role"
					onClose={() => {
						setShowRoleForm(false);
					}}
					action="/roles/createRole"
					method="POST"
					inputName="name"
					placeholder="name"
					minInput={1}
					maxInput={20}
					fetcher={fetcher}
				></ChangeModal>
			)}
			<div className="flex w-full h-full justify-center bg-back">
				<div className="w-11/12 my-10">
					<div className="flex justify-between items-center w-full ">
						<h1 className="text-3xl m-4 font-semibold font-head">
							Roles Management
						</h1>
						<CheckButton
							type="button"
							onClick={() => {
								setShowRoleForm(true);
							}}
							activeCheck={false}
							active
						>
							Add Role
						</CheckButton>
					</div>
					<List cols={headers}>
						{loaderData.roles.map((rls) => (
							<ListRoles key={rls.id} role={rls}></ListRoles>
						))}
					</List>
				</div>
			</div>
		</>
	);
}
