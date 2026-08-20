import { useEffect, useState, type JSX } from "react";
import { createRole, fetchRoles, toRoleInput } from "../api/roles";
import List from "../components/list";
import type { Route } from "./+types/admin_users";
import ListRoles from "../components/listRoles";
import CheckButton from "../../components/CheckButton";
import Modal from "../../components/Modal";
import { Input } from "../../components/Input";
import { data, Form, useFetcher } from "react-router";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientLoader() {
	const roles = await fetchRoles();

	return { roles };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({ request }: Route.ClientActionArgs) {
	const res = await createRole(toRoleInput(await request.formData()));

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
					<Form
						className="flex flex-col items-center w-1/2  gap-5"
						method="PUT"
					>
						<Input
							name="name"
							type="text"
							required
							placeholder="Name"
						/>
						<CheckButton type="submit">Ok</CheckButton>
					</Form>
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
					<List headers={["Role", "Permissions"]}>
						{loaderData.roles.map((rls) => (
							<ListRoles key={rls.id} role={rls}></ListRoles>
						))}
					</List>
				</div>
			</div>
		</>
	);
}
