import type { JSX } from "react";
import { fetchRoles } from "../api/roles";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientLoader() {
	const roles = await fetchRoles();

	return { roles };
}

export default function addPermision(): JSX.Element {
	return (
		<div className="flex w-full h-full justify-center bg-back">
			<div className="w-11/12 my-10">
				<div className="flex justify-between items-center w-full ">
					<h1 className="text-3xl m-4 font-semibold font-head">
						Role Management
					</h1>
					<button
						type="submit"
						className="w-1/3 h-10 bg-accent text-accent-text font-semibold rounded-4xl cursor-pointer hover:brightness-120"
					>
						Add User
					</button>
				</div>

				<div className="flex flex-col w-full my-10 bg-back2 rounded-md border-2 border-border">
					<div className="flex gap-20 h-15 justify-around items-center"></div>
				</div>
			</div>
		</div>
	);
}
