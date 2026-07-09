type ValidationErrors = Record<string, string[]>;

export interface ProblemDetail {
	type: string;
	title: string;
	status: number;
	detail?: string;
	errors?: ValidationErrors;
	errorCode: string;
	traceId: string;
}

export class APIError extends Error {
	public problem: ProblemDetail;

	public constructor(prob: ProblemDetail) {
		super();
		this.name = prob.title;
		this.cause = prob.errorCode;
		this.message = prob.detail ?? "";
		this.problem = prob;
	}
}
