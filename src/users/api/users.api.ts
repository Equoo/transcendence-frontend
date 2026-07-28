import { createContext } from "react-router";
import type { ProblemDetail } from "../../api/problem_detail";
import type { APIResult } from "../../api/results";

export interface User {
	id: string;
	userName: string;
}

// eslint-disable-next-line @eslint-react/no-missing-context-display-name
export const UserContext = createContext<User | null>(null);

export async function userFetcher(): Promise<APIResult<User>> {
	const res = await fetch("/api/me");

	if (!res.ok) {
		if (res.headers.get("Token-Expired") === "True") {
			console.warn("Using RefreshToken...");
			await fetch("/api/auth/refresh");
			await userFetcher();
		}
		return { ok: false, prob: (await res.json()) as ProblemDetail };
	}
	return { ok: true, res: (await res.json()) as User };
}
