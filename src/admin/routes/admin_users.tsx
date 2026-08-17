import { useState, type JSX } from "react";
import { fetchUsers } from "../api/users";
import ListUsers from "../components/listUsers";
import { PiMagnifyingGlass } from "react-icons/pi";
import type { Route } from "./+types/admin_users";
import { fetchRoles } from "../api/roles";
import ChangeBox from "../components/changebox";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientLoader() {
	const users = await fetchUsers();
	const roles = await fetchRoles();

	return { users, roles };
}

export default function AdminUser({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	const [showChange, setShowChange] = useState<boolean>(false);

	const switchShowChange = (): void => {
		setShowChange(!showChange);
	};

	return (
		<div className="w-full h-full bg-back">
			{showChange ? (
				<ChangeBox switchShowChange={switchShowChange} />
			) : null}
			<div className="flex justify-center flex-row gap-10 w-full h-full">
				<div className="flex flex-col gap-10 w-11/12 my-10">
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

							<button
								type="submit"
								className="w-1/3 h-10 bg-accent text-accent-text font-semibold rounded-4xl cursor-pointer hover:brightness-120"
							>
								Add User
							</button>
						</div>
					</div>
					<table className="w-full text-sm font-main text-left text-text">
						<thead className="text-sm text-body bg-surface border-b rounded-base border-border">
							<tr>
								<th
									scope="col"
									className="px-6 py-3 font-semibold text-lg"
								>
									Username
								</th>
								<th
									scope="col"
									className="px-6 py-3 font-semibold text-lg"
								>
									Role
								</th>
								<th
									scope="col"
									className="px-6 py-3 font-semibold text-lg"
								>
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{loaderData.users.map((usr) => (
								<ListUsers
									switchShowChange={switchShowChange}
									key={usr.id}
									user={usr}
									roles={loaderData.roles}
								></ListUsers>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
