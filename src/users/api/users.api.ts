import { createContext } from "react-router";
import type { ProblemDetail } from "../../api/problem_detail";
import type { APIResult } from "../../api/results";

export interface User {
	id: string;
	userName: string;
}

// eslint-disable-next-line @eslint-react/no-missing-context-display-name
export const UserContext = createContext<User | null>(null);

let refresh: Promise<Response> | null = null;

export async function userFetcher(): Promise<APIResult<User>> {
	let res = await fetch("/api/me");

	if (res.ok) {
		return { ok: true, res: (await res.json()) as User };
	}

	if (res.headers.get("Token-Expired") !== "True") {
		return { ok: false, prob: (await res.json()) as ProblemDetail };
	}

	refresh ??= fetch("/api/auth/refresh");

	const refreshResponse = await refresh;
	// eslint-disable-next-line require-atomic-updates
	refresh = null;

	if (!refreshResponse.ok) {
		return { ok: false, prob: (await res.json()) as ProblemDetail };
	}

	res = await fetch("/api/me");
	if (!res.ok) {
		return { ok: false, prob: (await res.json()) as ProblemDetail };
	}
	return { ok: true, res: (await res.json()) as User };
}
