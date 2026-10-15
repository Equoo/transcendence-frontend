/* eslint-disable id-length */
import { type JSX, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { isRouteErrorResponse, Outlet } from "react-router";

import { ActivityEnum, useActivity } from "@/activity/hooks/activity.hook";
import { APIError } from "@/api/problem_detail";
import { useRealtime } from "@/realtime";
import { Language, type User, UserContext } from "@/users/api/users";
import { UserReactContext } from "@/users/hooks/users";

import Sidebar from "../components/Sidebar/Sidebar";
import type { Route } from "./+types/dashboard";

export function clientLoader({ context }: Route.ClientLoaderArgs): {
	user: User;
} {
	return { user: context.get(UserContext) };
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
	useRealtime();
	const activity = useActivity();

	const { i18n } = useTranslation();

	const userLanguage = Language[loaderData.user.language];

	useEffect(() => {
		if (userLanguage !== i18n.languages[0]) {
			void i18n.changeLanguage(userLanguage);
		}
	}, [userLanguage, i18n]);

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
	const { t } = useTranslation();
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
			{t("errors.serverLoading")}
		</div>
	);
}
