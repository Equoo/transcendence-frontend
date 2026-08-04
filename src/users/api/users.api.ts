import { createContext } from "react-router";

export interface User {
	id: string;
	userName: string;
}

// eslint-disable-next-line @eslint-react/no-missing-context-display-name
export const UserContext = createContext<User>();

let refresh: Promise<Response> | null = null;

export async function userFetcher(): Promise<User | null> {
	let res = await fetch("/api/me");
	if (res.ok) {
		return (await res.json()) as User;
	}

	if (res.headers.get("Token-Expired") !== "True") {
		return null;
	}

	refresh ??= fetch("/api/auth/refresh");

	const refreshResponse = await refresh;
	// eslint-disable-next-line require-atomic-updates
	refresh = null;

	if (!refreshResponse.ok) {
		return null;
	}

	res = await fetch("/api/me");
	if (!res.ok) {
		return null;
	}
	return (await res.json()) as User;
}
