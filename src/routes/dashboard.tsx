import type { JSX } from "react";
import { Outlet } from "react-router";

import { UserReactContext } from "@/users/hooks/users.hooks";

import type { Route } from "../+types/root";
import Sidebar from "../components/Sidebar/Sidebar";
import { UserContext } from "../users/api/users.api";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function clientLoader({ context }: Route.LoaderArgs) {
	return context.get(UserContext);
}

export default function Dashboard({
	loaderData: user,
}: Route.ComponentProps): JSX.Element {
	return (
		<div className="relative w-full h-full overflow-hidden bg-back">
			<Sidebar />
			<div className="h-full sm:pl-64 flex flex-col w-full items-center overflow-y-scroll">
				<UserReactContext
					value={typeof user === "undefined" ? null : user}
				>
					<Outlet />
				</UserReactContext>
			</div>
		</div>
	);
}
