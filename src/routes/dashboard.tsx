import type { JSX } from "react";
import { isRouteErrorResponse, Outlet } from "react-router";
import Sidebar from "../components/Sidebar/Sidebar";
import { UserContext } from "../users/api/users.api";
import type { Route } from "../+types/root";
import { APIError } from "../api/problem_detail";

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

export function ErrorBoundary({
	error,
}: Route.ErrorBoundaryProps): JSX.Element {
	if (isRouteErrorResponse(error)) {
		return (
			<div className="w-full p-6 text-red-500 font-main">
				{error.status} — {error.statusText}
			</div>
		);
	} else if (error instanceof APIError) {
		return (
			<>
				<h1>{error.name}</h1>
				<div className="w-full p-6 text-red-500 font-main">
					{error.message}
				</div>
			</>
		);
	}
	return (
		<div className="w-full p-6 text-red-500 font-main">
			Server error during page loading
		</div>
	);
}
