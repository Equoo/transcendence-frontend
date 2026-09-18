import { createContext } from "react-router";

import { APIError, type ProblemDetail } from "@/api/problem_detail";

import type { Role } from "../../admin/api/roles";
import type { AppFile } from "../../files/api/files.api";

export interface User {
	id: string;
	userName: string;
	channelsAckMsg: Map<string, Date>;
	role: Role;
	avatar?: AppFile;
}

// eslint-disable-next-line @eslint-react/no-missing-context-display-name
export const UserContext = createContext<User>();

let refresh: Promise<Response> | null = null;

interface UserDto {
	id: string;
	userName: string;
	channelsAckMsg: Record<string, string>;
	role: Role;
	avatar?: AppFile;
}

function normalizeUser(dto: UserDto): User {
	return {
		id: dto.id,
		userName: dto.userName,
		channelsAckMsg: new Map(
			Object.entries(dto.channelsAckMsg).map(([key, val]) => [
				key,
				new Date(val),
			]),
		),
		role: dto.role,
		avatar: dto.avatar,
	};
}

export async function userLogout(): Promise<void> {
	const res = await fetch("/api/auth/logout");
	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
}

export async function userFetcher(): Promise<User | null> {
	let res = await fetch("/api/me");
	if (res.ok) {
		return normalizeUser((await res.json()) as UserDto);
	}

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

export async function fetchUsers(): Promise<User[]> {
	const res = await fetch("/api/users");

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
	return (await res.json()) as User[];
}
