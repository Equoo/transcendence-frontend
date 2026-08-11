import type { JSX } from "react";
import { fetchUsers } from "../api/users";
import ListUsers from "../components/listUsers";
import { PiMagnifyingGlass } from "react-icons/pi";
import type { Route } from "./+types/admin_users";
import { fetchRoles } from "../api/roles";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientLoader() {
	const users = await fetchUsers();
	const roles = await fetchRoles();

	return { users, roles };
}

export default function AdminUser({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	return (
		<div className="flex w-full h-full justify-center bg-back">
			<div className="w-11/12 my-10">
				<div className="flex justify-between items-center w-full ">
					<h1 className="text-3xl m-4 font-semibold font-head">
						User Management
					</h1>
					<div className="flex gap-10">
						<div className="flex h-10 bg-white border-2 border-border  rounded-md justify-center items-center">
							<input
								className="w-15/16 pl-2.5"
								placeholder="Search User"
							></input>
							<PiMagnifyingGlass className="m-5 size-5"></PiMagnifyingGlass>
						</div>

						<button className="w-1/3 h-10 bg-accent text-accent-text font-semibold rounded-4xl cursor-pointer hover:brightness-120">
							Add User
						</button>
					</div>
				</div>

				<table className="w-full text-center border-2">
					<tr className="border">
						<th className="border-1 w-1/3">Username</th>
						<th className="border-1 w-1/3">Role</th>
						<th className="border-1 w-1/3">Action</th>
					</tr>
					{loaderData.users.map((usr) => (
						<ListUsers key={usr.id} user={usr} roles={loaderData.roles}></ListUsers>
					))}
				</table>
			</div>
		</div>
	);
}
