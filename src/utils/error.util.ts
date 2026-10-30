import i18n from "i18next";
import { createElement } from "react";
import toast from "react-hot-toast";

import { APIError } from "@/api/problem_detail";
import Alert from "@/components/Alert";

export function toastError(err: Error): void {
	toast.error(
		createElement(
			Alert,
			err instanceof APIError
				? { title: err.problem.title, detail: err.problem.detail }
				: { title: i18n.t("errors.somethingWrong"), detail: err.message },
		),
	);
}
