import type { JSX } from "react";
import { PiArrowClockwise, PiHouse, PiWarningCircle } from "react-icons/pi";
import {
	isRouteErrorResponse,
	Link,
	Outlet,
	useRevalidator,
} from "react-router";

import { APIError } from "@/api/problem_detail";
import CheckButton from "@/components/CheckButton";

import type { Route } from "./+types/dashboard_content";

export default function DashboardContent(): JSX.Element {
	return <Outlet />;
}

interface ErrorInfos {
	code: number | string | null;
	title: string;
	detail: string;
	trace: string | null;
}

function describeError(error: unknown): ErrorInfos {
	if (isRouteErrorResponse(error)) {
		return {
			trace: null,
			code: error.status,
			title: error.status === 404 ? "Page not found" : error.statusText,
			detail:
				error.status === 404
					? "This page doesn't exist or has been moved."
					: "The page couldn't be loaded.",
		};
	}
	if (error instanceof APIError) {
		return {
			code: error.problem.status,
			title: error.name || "Request failed",
			detail: error.message || "The server rejected the request.",
			trace: error.problem.traceId,
		};
	}
	return {
		code: null,
		trace: null,
		title: "Something went wrong",
		detail:
			error instanceof Error && error.message
				? error.message
				: "An unexpected error occurred while loading this page.",
	};
}

export function ErrorBoundary({
	error,
}: Route.ErrorBoundaryProps): JSX.Element {
	const revalidator = useRevalidator();
	const { code, title, detail, trace } = describeError(error);

	return (
		<div className="flex h-full items-center justify-center w-full p-6 font-main">
			<div className="flex flex-col items-center gap-6 w-md px-10 py-9 rounded-2xl bg-surface border border-border shadow-main text-center animate-in">
				<div className="flex items-center justify-center size-14 rounded-2xl bg-error-soft text-error">
					<PiWarningCircle size={30} />
				</div>

				<div className="flex flex-col items-center gap-1.5">
					{code !== null && (
						<span className="text-sm font-semibold text-muted tracking-wide">
							Error {code}
						</span>
					)}
					<h1 className="text-2xl font-semibold font-head text-text tracking-tight">
						{title}
					</h1>
					<p className="text-sm text-text2">{detail}</p>
				</div>

				<div className="flex gap-3">
					<CheckButton
						active={false}
						onClick={() => {
							void revalidator.revalidate();
						}}
						disabled={revalidator.state === "loading"}
						pending={revalidator.state === "loading"}
					>
						<PiArrowClockwise size={18} />
						Go Back
					</CheckButton>
					<Link to="/">
						<CheckButton active activeCheck={false}>
							<PiHouse size={18} />
							Home
						</CheckButton>
					</Link>
				</div>

				{trace !== null && (
					<span className="text-xs text-muted font-mono break-all">
						Trace: {trace}
					</span>
				)}
			</div>
		</div>
	);
}
