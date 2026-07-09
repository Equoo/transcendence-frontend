import type { ProblemDetail } from "./problem_detail";

export type APIResult<ResultType> =
	| { ok: true; res: ResultType }
	| { ok: false; prob: ProblemDetail };
