import { type JSX, useEffect } from "react";
import { ErrorBoundary as SidebarBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router";

import { ActivityEnum, useActivity } from "@/activity/hooks/activity.hook";
import { type Channel, fetchChannels } from "@/chat/api/chat.api";
import { useChatHub } from "@/chat/hooks/chatHub.hook";
import ErrorPage from "@/components/Error/ErrorPage";
import { SidebarError } from "@/components/Sidebar/SidebarError";
import {
	Language,
	type User,
	UserContext,
} from "@/users/api/users";
import { UserReactContext } from "@/users/hooks/users";

import Sidebar from "../components/Sidebar/Sidebar";
import type { Route } from "./+types/dashboard";

export async function clientLoader({
	context,
}: Route.ClientLoaderArgs): Promise<{
	user: User;
	channels: Promise<Channel[]>;
}> {
	await useChatHub.getState().connect();
	const user = context.get(UserContext);

	return { user, channels: fetchChannels() };
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
	const location = useLocation();

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
			<SidebarBoundary
				resetKeys={[location.pathname]}
				FallbackComponent={SidebarError}
			>
				<Sidebar
					user={loaderData.user}
					channels={loaderData.channels}
				/>
			</SidebarBoundary>
			<div className="h-full sm:pl-64 flex flex-col w-full items-center overflow-y-scroll">
				<UserReactContext value={loaderData.user}>
					<Outlet />
				</UserReactContext>
			</div>
		</div>
	);
}

// Only reached when the dashboard itself can't be rendered (e.g. its loader
// failed): there is no sidebar to keep, so show a full page error.
export function ErrorBoundary({
	error,
}: Route.ErrorBoundaryProps): JSX.Element {
	return <ErrorPage error={error} />;
}
