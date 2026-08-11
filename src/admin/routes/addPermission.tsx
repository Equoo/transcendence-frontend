import type { JSX } from "react";
import { fetchRoles, type Role } from "../api/roles";
import type { Route } from "./+types/admin";
import ListRoles from "../components/listRoles";
import { ContainerItem } from "../components/listUsers";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientLoader() {
	const roles = await fetchRoles();

	return { roles };
}

export default function addPermision({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	const roles = loaderData.roles as unknown as Role[];

	const rolesMap = roles.map((rls) => (
		<ListRoles key={rls.id} role={rls}></ListRoles>
	));

	return (
		<div className="flex w-full h-full justify-center bg-back">
			<div className="w-11/12 my-10">
				<div className="flex justify-between items-center w-full ">
					<h1 className="text-3xl m-4 font-semibold font-head">
						Role Management
					</h1>
					<button className="w-1/3 h-10 bg-accent text-accent-text font-semibold rounded-4xl cursor-pointer hover:brightness-120">
						Add User
					</button>
				</div>

				<div className="flex flex-col w-full my-10 bg-back2 rounded-md border-2 border-border">
					<div className="flex gap-20 h-15 justify-around items-center">
						<ContainerItem
							data={"Name"}
							className="text-xl font-head font-semibold"
						/>
						<ContainerItem
							data={"IsAdmin"}
							className="text-xl font-head font-semibold"
						></ContainerItem>
						<ContainerItem
							data=""
							className="text-xl font-head font-semibold"
						></ContainerItem>
					</div>
				</div>
			</div>
		</div>
	);
}
