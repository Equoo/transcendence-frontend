import { createContext } from "react-router";

import { ActivityEnum, useActivity } from "@/activity/hooks/activity.hook";
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

interface UsernameRequest {
	UserName: string;
}

interface PasswordRequest {
	Password: string;
	NewPassword: string;
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

function toUsernameRequest(formdata: FormData): UsernameRequest {
	return {
		UserName: formdata.get("Username") as string,
	};
}

function toPasswordRequest(formdata: FormData): PasswordRequest {
	formdata;
	return {
		Password: formdata.get("Current password") as string,
		NewPassword: formdata.get("New password") as string,
	};
}

export async function userChangeUsername(
	formdata: FormData,
): Promise<Response> {
	const req = toUsernameRequest(formdata);
	const res = await fetch("/api/me", {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(req),
	});
	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
	return res;
}

export async function userDeleteAccount(): Promise<Response> {
	const res = await fetch("/api/me", { method: "DELETE" });
	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
	return res;
}

export async function userChangePassword(
	formdata: FormData,
): Promise<Response> {
	const req = toPasswordRequest(formdata);
	const res = await fetch("/api/me/password", {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(req),
	});
	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
	return res;
}

export async function userLogout(): Promise<Response> {
	const res = await fetch("/api/auth/logout");
	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
	const activity = useActivity.getState();
	await activity.setSelfActivity(ActivityEnum.Offline);
	return res;
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
