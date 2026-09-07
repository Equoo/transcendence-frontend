import { useEffect, useState, type JSX } from "react";
import { fetchRoles, PermEnum } from "../admin/api/roles";
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

	const headers: string[] = ["Name"];

	for (const key in PermEnum) {
		if (!isNaN(Number(key))) {
			// eslint-disable-next-line no-continue
			continue;
		}
		headers.push(key);
	}

	headers.push("Actions");

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
					<List headers={headers}>
						{loaderData.roles.map((rls) => (
							<ListRoles key={rls.id} role={rls}></ListRoles>
						))}
					</List>
				</div>
			</div>
		</>
	);
}
