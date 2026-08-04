import type { JSX } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar/Sidebar";
import { UserContext } from "../users/api/users.api";
import type { Route } from "../+types/root";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function clientLoader({ context }: Route.LoaderArgs) {
	const user = context.get(UserContext);
	return user;
}

export default function Dashboard(): JSX.Element {
	return (
		<div className="relative w-full h-full overflow-hidden bg-back">
			<Sidebar />
			<div className="h-full sm:pl-64 flex flex-col w-full items-center overflow-y-scroll">
				<Outlet />
			</div>
		</div>
	);
}
