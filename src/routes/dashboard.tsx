import type { JSX } from "react";
import { isRouteErrorResponse, Outlet } from "react-router";

import { APIError } from "@/api/problem_detail";
import { useChatHub } from "@/chat/hooks/chatHub.hook";
import { UserReactContext } from "@/users/hooks/users.hooks";

import Sidebar from "../components/Sidebar/Sidebar";
import { type User, UserContext } from "../users/api/users.api";
import type { Route } from "./+types/dashboard";

export function clientLoader({ context }: Route.ClientLoaderArgs): {
	user: User;
} {
	const user = context.get(UserContext);
	return { user };
}

export default function Dashboard({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	const connectChatHub = useChatHub((state) => state.connect);
	connectChatHub();

	return (
		<div className="relative w-full h-full overflow-hidden bg-back">
			<Sidebar user={loaderData.user} />
			<div className="h-full sm:pl-64 flex flex-col w-full items-center overflow-y-scroll">
				<UserReactContext value={loaderData.user}>
					<Outlet />
				</UserReactContext>
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
