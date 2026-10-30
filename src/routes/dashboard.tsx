/* eslint-disable id-length */
import { type JSX, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PiArrowClockwise, PiHouse, PiWarningCircle } from "react-icons/pi";
import { Link, Outlet, useRevalidator } from "react-router";

import { ActivityEnum, useActivity } from "@/activity/hooks/activity.hook";
import CheckButton from "@/components/Button/CheckButton";
import { useRealtime } from "@/realtime";
import { Language, type User, UserContext } from "@/users/api/users";
import { UserReactContext } from "@/users/hooks/users";

import Sidebar from "../components/Sidebar/Sidebar";
import type { Route } from "./+types/dashboard";
import { describeError } from "./dashboard_content";

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
			<div className="h-full lg:pl-64 flex flex-col w-full overflow-y-scroll">
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
	const revalidator = useRevalidator();
	const { code, title, detail, trace } = describeError(error, t);

	return (
		<div className="flex h-full items-center justify-center w-full p-6 font-main">
			<div className="flex flex-col items-center gap-6 w-full max-w-md px-6 py-8 sm:px-10 sm:py-9 rounded-2xl bg-surface border border-border shadow-main text-center animate-in">
				<div className="flex items-center justify-center size-14 rounded-2xl bg-error-soft text-error">
					<PiWarningCircle size={30} />
				</div>

				<div className="flex flex-col items-center gap-1.5">
					{code !== null && (
						<span className="text-sm font-semibold text-muted tracking-wide">
							{t("errors.code", { code })}
						</span>
					)}
					<h1 className="text-2xl font-semibold font-head text-text tracking-tight">
						{title}
					</h1>
					<p className="text-sm text-text2">{detail}</p>
				</div>

				<div className="flex flex-wrap justify-center gap-3">
					<CheckButton
						active={false}
						onClick={() => {
							void revalidator.revalidate();
						}}
						disabled={revalidator.state === "loading"}
						pending={revalidator.state === "loading"}
					>
						<PiArrowClockwise size={18} />
						{t("common.goBack")}
					</CheckButton>
					<Link to="/">
						<CheckButton active activeCheck={false}>
							<PiHouse size={18} />
							{t("common.home")}
						</CheckButton>
					</Link>
				</div>

				{trace !== null && (
					<span className="text-xs text-muted font-mono break-all">
						{t("errors.trace", { trace })}
					</span>
				)}
			</div>
		</div>
	);
}
