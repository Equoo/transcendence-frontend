import { type JSX, useEffect, useState } from "react";
import { data, useFetcher } from "react-router";

import CheckButton from "../../components/CheckButton";
import { Input } from "../../components/Input";
import List from "../../components/List";
import Modal from "../../components/Modal";
import {
	changeRoleName,
	createRole,
	deleteRole,
	fetchRoles,
	toRoleInput,
} from "../api/roles";
import ListRoles from "../components/listRoles";
import type { Route } from "./+types/admin_users";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientLoader() {
	const roles = await fetchRoles();

	return { roles };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({ request }: Route.ClientActionArgs) {
	let res;
	if (request.method === "POST") {
		res = await createRole(toRoleInput(await request.formData()));
	}
	if (request.method === "PATCH") {
		const dataRequest = await request.formData();

		res = await changeRoleName(
			dataRequest.get("id") as string,
			dataRequest.get("name") as string,
		);
	}
	if (request.method === "DELETE") {
		res = await deleteRole((await request.formData()).get("id") as string);
	}

	return data(res, { status: 201 });
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

	return (
		<>
			{showRoleForm && (
				<Modal
					title="Create Role"
					onClose={() => {
						setShowRoleForm(false);
					}}
				>
					<fetcher.Form
						className="flex flex-col items-center w-1/2  gap-5"
						method="POST"
					>
						<Input
							name="name"
							type="text"
							required
							placeholder="Name"
						/>
						<CheckButton type="submit">Ok</CheckButton>
					</fetcher.Form>
				</Modal>
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
					<List
						empty={loaderData.roles.length === 0}
						emptyMessage="No roles to display."
						cols={[
							{ id: "Role", pos: "text-left" },
							{
								id: "IsAdmin",
								pos: "text-center",
							},
							{
								id: "HandleEvent",
								pos: "text-center",
							},
							{
								id: "GetUser",
								pos: "text-center",
							},
							{
								id: "InviteUser",
								pos: "text-center",
							},
							{
								id: "ChangeUsername",
								pos: "text-center",
							},
							{
								id: "DeleteUser",
								pos: "text-center",
							},
							{
								id: "ResetPassword",
								pos: "text-center",
							},
							{
								id: "HandleChannel",
								pos: "text-center",
							},
							{
								id: "Actions",
								pos: "text-right",
							},
						]}
					>
						{loaderData.roles.map((rls) => (
							<ListRoles key={rls.id} role={rls}></ListRoles>
						))}
					</List>
				</div>
			</div>
		</>
	);
}
