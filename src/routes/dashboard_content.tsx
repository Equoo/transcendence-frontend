import type { JSX } from "react";
import { Outlet, useRevalidator } from "react-router";

import ErrorPage from "@/components/Error/ErrorPage";

import type { Route } from "./+types/dashboard_content";

export default function DashboardContent(): JSX.Element {
	return <Outlet />;
}

export function ErrorBoundary({
	error,
}: Route.ErrorBoundaryProps): JSX.Element {
	const revalidator = useRevalidator();

	return (
		<ErrorPage
			error={error}
			onRetry={() => {
				void revalidator.revalidate();
			}}
			retrying={revalidator.state === "loading"}
		/>
	);
}
