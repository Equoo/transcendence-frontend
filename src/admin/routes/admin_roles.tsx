import { useEffect, useState, type JSX } from "react";
import {
	changeRoleName,
	createRole,
	deleteRole,
	fetchRoles,
	toRoleInput,
} from "../api/roles";
import List from "../components/list";
import type { Route } from "./+types/admin_users";
import ListRoles from "../components/listRoles";
import CheckButton from "../../components/CheckButton";
import Modal from "../../components/Modal";
import { Input } from "../../components/Input";
import { data, useFetcher } from "react-router";

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
	const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
	const [RoleId, setRoleId] = useState<string | null>(null);
	const [showChangeRole, setShowChangeRole] = useState<boolean>(false);
	const fetcher = useFetcher();

	useEffect(() => {
		if (fetcher.data) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowRoleForm(false);
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowConfirmation(false);
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowChangeRole(false);
		}
	}, [fetcher.data]);

	return (
		<>
			{showChangeRole && (
				<Modal
					title={`Change role's name`}
					onClose={() => {
						setShowChangeRole(false);
					}}
				>
					<fetcher.Form
						className="flex flex-col items-center gap-5"
						method="PATCH"
					>
						<input
							type="hidden"
							name="id"
							value={String(RoleId)}
						></input>
						<input
							name="name"
							required
							className="ring-0 focus:border-border border-border rounded-sm"
							type="text"
							placeholder="New Name"
						></input>
						<CheckButton active type="submit">
							OK
						</CheckButton>
					</fetcher.Form>
				</Modal>
			)}
			{showConfirmation && (
				<Modal
					title={`Delete the role ?`}
					onClose={() => {
						setShowConfirmation(false);
					}}
				>
					<p className="text-muted font-main font-light w-4/5 text-sm text-center">
						All users using this role will become member instead.
						This cannot be cancelled.
					</p>
					<fetcher.Form method="DELETE" className="inline-flex gap-8">
						<input
							type="hidden"
							name="id"
							value={String(RoleId)}
						></input>
						<CheckButton
							pending={fetcher.state !== "idle"}
							type="submit"
						>
							Yes
						</CheckButton>
						<CheckButton
							active
							activeCheck={false}
							onClick={() => {
								setShowConfirmation(false);
							}}
						>
							No
						</CheckButton>
					</fetcher.Form>
				</Modal>
			)}
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
						headers={[
							"Role",
							"IsAdmin",
							"HandleEvent",
							"GetUser",
							"InviteUser",
							"ChangeUsername",
							"DeleteUser",
							"ResetPassword",
							"HandleChannel",
							"Actions",
						]}
					>
						{loaderData.roles.map((rls) => (
							<ListRoles
								key={rls.id}
								role={rls}
								setShowConfirmation={setShowConfirmation}
								setRoleId={setRoleId}
								setShowChangeRole={setShowChangeRole}
							></ListRoles>
						))}
					</List>
				</div>
			</div>
		</>
	);
}
