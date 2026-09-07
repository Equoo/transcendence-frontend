import { useEffect, useState, type JSX } from "react";
import { fetchRoles } from "../admin/api/roles";
import List from "../components/List";
import ListRoles from "../admin/components/AdminListRoles";
import CheckButton from "../components/CheckButton";
import Modal from "../components/Modal";
import { Input } from "../components/Input";
import { useFetcher } from "react-router";
import type { Route } from "./+types/admin_roles";

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
						action="/roles"
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
