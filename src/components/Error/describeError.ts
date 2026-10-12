import type { TFunction } from "i18next";
import { isRouteErrorResponse } from "react-router";

import { APIError } from "@/api/problem_detail";

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
