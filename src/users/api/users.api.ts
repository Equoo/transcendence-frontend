import { createContext } from "react-router";

export interface User {
	id: string;
	userName: string;
	channelsAckMsg: Map<string, Date>;
}

// eslint-disable-next-line @eslint-react/no-missing-context-display-name
export const UserContext = createContext<User | null>(null);

let refresh: Promise<Response> | null = null;

interface UserDto {
	id: string;
	userName: string;
	channelsAckMsg: Record<string, string>;
}

function normalizeUser(dto: UserDto): User {
	return {
		id: dto.id,
		userName: dto.userName,
		channelsAckMsg: new Map(
			Object.entries(dto.channelsAckMsg).map(([key, val]) => [key, new Date(val)]),
		),
	};
}

export async function userFetcher(): Promise<User | null> {
	let res = await fetch("/api/me");
	if (res.ok) {
		return normalizeUser((await res.json()) as UserDto)
	};

	if (res.headers.get("Token-Expired") !== "True") {
		return null;
	}

	refresh ??= fetch("/api/auth/refresh").finally(() => {
		refresh = null;
	});
	const refreshResponse = await refresh;

	if (!refreshResponse.ok) {
		return null;
	}

	res = await fetch("/api/me");
	if (!res.ok) {
		return null;
	}
	return normalizeUser((await res.json()) as UserDto);
}
