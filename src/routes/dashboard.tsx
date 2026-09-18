import { type JSX, useEffect } from "react";
import { isRouteErrorResponse, Outlet } from "react-router";

import { ActivityEnum, useActivity } from "@/activity/hooks/activity.hook";
import { APIError } from "@/api/problem_detail";
import { useChatHub } from "@/chat/hooks/chatHub.hook";
import { type User, UserContext, userLogout } from "@/users/api/users.api";
import { UserReactContext } from "@/users/hooks/users.hooks";

import Sidebar from "../components/Sidebar/Sidebar";
import type { Route } from "./+types/dashboard";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({ request }: Route.ClientLoaderArgs) {
	if (request.method === "DELETE") {
		await userLogout();
	}
}

export async function clientLoader({
	context,
}: Route.ClientLoaderArgs): Promise<{
	user: User;
}> {
	await useChatHub.getState().connect();
	const user = context.get(UserContext);
	return { user };
}

let unloading = false;

function handleVisibility(): void {
	if (unloading) {
		return;
	}

	const activity = useActivity.getState();
	if (document.hidden) {
		void activity.setSelfActivity(ActivityEnum.Afk);
	} else {
		void activity.setSelfActivity(ActivityEnum.Online);
	}
}

function handleUnload(): undefined {
	unloading = true;
	void useActivity.getState().setSelfActivity(ActivityEnum.Offline);

	// eslint-disable-next-line no-undefined
	return undefined;
}

export default function Dashboard({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	const activity = useActivity();

	useEffect(() => {
		activity.setSelfId(loaderData.user.id);
		unloading = false;
		document.addEventListener("visibilitychange", handleVisibility);
		window.addEventListener("beforeunload", handleUnload);
		void activity.setSelfActivity(ActivityEnum.Online);
		activity.askOthersActivity();

		return (): void => {
			document.removeEventListener("visibilitychange", handleVisibility);
			window.removeEventListener("beforeunload", handleUnload);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
