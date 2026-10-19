import "../../translation/i18n";

import { createContext } from "react-router";

import { ActivityEnum, useActivity } from "@/activity/hooks/activity.hook";
import { APIError, type ProblemDetail } from "@/api/problem_detail";
import { request, requestJson } from "@/api/request";
import callApi from "@/tokens/callApi";

import type { Role } from "../../admin/api/roles";
import type { AppFile } from "../../files/api/files.api";

// eslint-disable-next-line @eslint-react/no-missing-context-display-name
export const UserContext = createContext<User>();

// Interface

export enum Language {
	fr = 0,
	en = 1,
	tc = 2,
}

export interface User {
	id: string;
	userName: string;
	channelsAckMsg: Map<string, Date>;
	role: Role;
	avatar?: AppFile;
	language: Language;
}

interface UserDto {
	id: string;
	userName: string;
	channelsAckMsg: Record<string, string>;
	role: Role;
	avatar?: AppFile;
	language: Language;
}

interface UsernameRequest {
	UserName: string;
}

interface PasswordRequest {
	Password: string;
	NewPassword: string;
}

// Function Interface

function normalizeUser(dto: UserDto): User {
	return {
		id: dto.id,
		userName: dto.userName,
		language: dto.language,
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

// Function API

export async function userChangeAvatar(formdata: FormData): Promise<Response> {
	const res = await callApi("/api/me/avatar", {
		method: "PATCH",
		body: formdata,
	});
	return res;
}

export async function userChangeUsername(
	formdata: FormData,
): Promise<Response> {
	const req = toUsernameRequest(formdata);
	return request("/api/me", "PATCH", req);
}

export async function userDeleteAccount(): Promise<Response> {
	return request("/api/me", "DELETE");
}

export async function userChangeLanguage(
	formdata: FormData,
): Promise<Response> {
	const res = await callApi("/api/me/language", {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(Number(formdata.get("language"))),
	});
	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}

	return res;
}

export async function userChangePassword(
	formdata: FormData,
): Promise<Response> {
	const req = toPasswordRequest(formdata);
	return request("/api/me/password", "PATCH", req);
}

export async function userLogout(): Promise<Response> {
	const res = await request("/api/auth/logout");

	window.location.assign("/login");
	const activity = useActivity.getState();
	await activity.setSelfActivity(ActivityEnum.Offline);
	return res;
}

export async function userDeleteAvatar(): Promise<Response> {
	return request("/api/me/avatar", "DELETE");
}

export async function fetchUser(): Promise<User | null> {
	const res = await callApi("/api/me");
	if (!res.ok) {
		return null;
	}

	return normalizeUser((await res.json()) as UserDto);
}

export async function fetchUsers(): Promise<User[]> {
	return requestJson<User[]>("/api/users");
}
