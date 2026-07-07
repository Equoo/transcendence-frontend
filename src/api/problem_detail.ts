type ValidationErrors = Record<string, string[]>;

export interface ProblemDetail extends Error {
	type: string;
	title: string;
	status: number;
	detail?: string;
	errors?: ValidationErrors;
	errorCode: string;
	traceId: string;
}
