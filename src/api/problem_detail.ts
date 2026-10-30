import i18n from "i18next";

export type ValidationErrors = Record<string, string[]>;

export interface ProblemDetail {
	type: string;
	title: string;
	status: number;
	detail?: string;
	errors?: ValidationErrors;
	errorCode: string;
	traceId: string;
}

const FIELD_MESSAGES: [RegExp, string][] = [
	[/field is required\.$/u, "required"],
	[
		/minimum length of '(?<min>\d+)' and maximum length of '(?<max>\d+)'/u,
		"length",
	],
	[/minimum length of '(?<min>\d+)'\.$/u, "minLength"],
	[/maximum length of '(?<max>\d+)'\.$/u, "maxLength"],
	[/must be between (?<min>\S+) and (?<max>\S+)\.$/u, "range"],
	[/is not a valid e-mail address\.$/u, "email"],
	[/must match the regular expression/u, "pattern"],
	[/^Username can only contain/u, "username"],
	[/NUL \(U\+0000\)/u, "nul"],
];

function translateFieldMessage(message: string): string {
	for (const [pattern, key] of FIELD_MESSAGES) {
		const match = pattern.exec(message);
		if (match) {
			return i18n.t(`apiErrors.fields.${key}`, { ...match.groups });
		}
	}
	return message;
}

function detailParams(detail: string): { value?: string; count?: number } {
	const value = (/^'(?<name>.*)' /u.exec(detail) ?? /'(?<name>[^']*)'/u.exec(detail))
		?.groups?.name;
	const count = /\d+/u.exec(detail.replace(/'[^']*'/gu, ""))?.[0];

	return {
		...(typeof value === "string" ? { value } : {}),
		...(typeof count === "string" ? { count: Number(count) } : {}),
	};
}

export function translateProblem(prob: ProblemDetail): ProblemDetail {
	const key = `apiErrors.codes.${prob.errorCode}`;
	const errors =
		prob.errors &&
		Object.fromEntries(
			Object.entries(prob.errors).map(([field, messages]) => [
				field,
				messages.map(translateFieldMessage),
			]),
		);

	if (i18n.exists(`${key}.title`)) {
		return {
			...prob,
			title: i18n.t(`${key}.title`),
			detail: i18n.t(`${key}.detail`, detailParams(prob.detail ?? "")),
			errors,
		};
	}
	if (errors) {
		return {
			...prob,
			title: i18n.t("apiErrors.invalidInput.title"),
			detail:
				typeof prob.detail === "string"
					? i18n.t("apiErrors.invalidInput.detail")
					: prob.detail,
			errors,
		};
	}
	return prob;
}

export class APIError extends Error {
	public problem: ProblemDetail;

	public constructor(prob: ProblemDetail) {
		super();
		const translated = translateProblem(prob);
		this.name = translated.title;
		this.cause = translated.errorCode;
		this.message = translated.detail ?? "";
		this.problem = translated;
	}
}

const NO_ERRORS: ValidationErrors = {};

export function validationErrors(data: unknown): ValidationErrors {
	return data instanceof APIError
		? (data.problem.errors ?? NO_ERRORS)
		: NO_ERRORS;
}

export function otherErrors(
	errors: ValidationErrors,
	fieldKeys: string[],
): string[] {
	return Object.entries(errors)
		.filter(([key]) => !fieldKeys.includes(key))
		.flatMap(([, messages]) => messages);
}
