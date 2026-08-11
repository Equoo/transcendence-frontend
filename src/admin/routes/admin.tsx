import type { JSX } from "react";
import AdminBox from "../components/checkbox";
import { useFetcher, type ClientActionFunctionArgs } from "react-router";
import { fetchRoles, Perm, toRoleInput, type Role } from "../api/roles";
import type { Route } from "./+types/admin";
import ListRoles from "../components/listRoles";
import { fetchUsers } from "../api/users";
import ListUsers from "../components/listUsers";
import type { User } from "../../api/users";

export async function createRole(data: FormData): Promise<null> {
	const res = await fetch("/api/roles", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(toRoleInput(data)),
	});

	if (!res.ok) {
		console.warn("LE TRUC DE MERDE IL A FAIL");
		return null;
	}
	console.warn("CA A RESUSSSIS !!!");
	return null;
}

export async function clientAction({
	request,
}: ClientActionFunctionArgs): Promise<null> {
	await createRole(await request.formData());
	return null;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientLoader() {
	const roles = await fetchRoles();
	const users = await fetchUsers();

	return { roles, users };
}

export default function Admin({
	loaderData: loaderdata,
}: Route.ComponentProps): JSX.Element {
	const fetcher = useFetcher();

	const roles = loaderdata.roles as unknown as Role[];

	const rolesMap = roles.map((rls) => (
		<ListRoles key={rls.id} role={rls}></ListRoles>
	));

	const users = loaderdata.users as unknown as User[];
	const usersMap = users.map((usr) => (
		<ListUsers key={usr.id} user={usr}></ListUsers>
	));

	return (
		<div className="flex justify-center items-center w-full h-full">
			{/* <div className="flex justify-center gap-20">
				<fetcher.Form className="flex flex-col gap-6" method="post">
					<h1 className="text-3xl">Create Roles</h1>
					<input type="text" name="name"></input>
					<AdminBox name="isAdmin" value={Perm.isAdmin}></AdminBox>
					<AdminBox
						name="CreateEvent"
						value={Perm.HandleEvent}
					></AdminBox>
					<AdminBox
						name="GetEvent"
						value={Perm.HandleChannel}
					></AdminBox>
					<button type="submit" className="border-2 w-1/2">
						Create
					</button>
				</fetcher.Form>
				<div className="flex flex-col gap-4">
					<h1 className="text-3xl"> List Role</h1>
					{rolesMap}
				</div>
				<div className="flex flex-col gap-4">
					<fetcher.Form method="post">
						<h1 className="text-3xl"> List User</h1>
						{usersMap}
						<button type="submit">SUBMIT</button>
					</fetcher.Form>
				</div>
			</div> */}
		</div>
	);
}
