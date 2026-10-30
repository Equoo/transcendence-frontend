import type { TFunction } from "i18next";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { PiArrowClockwise, PiHouse, PiWarningCircle } from "react-icons/pi";
import {
	isRouteErrorResponse,
	Link,
	Outlet,
	useRevalidator,
} from "react-router";

import { APIError } from "@/api/problem_detail";
import CheckButton from "@/components/Button/CheckButton";

import type { Route } from "./+types/dashboard_content";

export default function DashboardContent(): JSX.Element {
	return <Outlet />;
}

export interface ErrorInfos {
	code: number | string | null;
	title: string;
	detail: string;
	trace: string | null;
}

// eslint-disable-next-line id-length
export function describeError(error: unknown, t: TFunction): ErrorInfos {
	if (isRouteErrorResponse(error)) {
		return {
			trace: null,
			code: error.status,
			title:
				error.status === 404
					? t("errors.pageNotFound")
					: error.statusText,
			detail:
				error.status === 404
					? t("errors.pageNotFoundDetail")
					: t("errors.pageLoadFailed"),
		};
	}
	if (error instanceof APIError) {
		return {
			code: error.problem.status,
			title: error.name || t("errors.requestFailed"),
			detail: error.message || t("errors.requestRejected"),
			trace: error.problem.traceId,
		};
	}
	return {
		code: null,
		trace: null,
		title: t("errors.somethingWrong"),
		detail:
			error instanceof Error && error.message
				? error.message
				: t("errors.unexpected"),
	};
}

export function ErrorBoundary({
	error,
}: Route.ErrorBoundaryProps): JSX.Element {
	// eslint-disable-next-line id-length
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
