import { APIError, type ProblemDetail } from "../../api/problem_detail";

export interface RoleInput {
	Name: string;
	Permission: number;
}

export interface Role {
	id: string;
	name: string;
	permission: number;
}

export enum Perm {
	isAdmin = 1,

	// Event
	HandleEvent = 2,

	// User
	GetUser = 32,
	CreateUser = 64,
	ChangeUserName = 128,
	DeleteUser = 256,
	ResetUserPassword = 516,

	// Chat
	HandleChannel = 2048,

	// Knowledge

	// Calendar
}

export async function fetchRoles(): Promise<Role[]> {
	const res = await fetch("/api/roles");

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}

	const roles = (await res.json()) as Role[];

	return roles;
}

function getPermissionBytes(data: FormData): number {
	let permission = 0 as number;
	for (const pair of data.entries()) {
		if (pair[0] === "name") {
			// eslint-disable-next-line no-continue
			continue;
		}
		permission += Number(pair[1]);
	}
	return permission;
}
export function toRoleInput(data: FormData): RoleInput {
	return {
		Name: data.get("name") as string,
		Permission: getPermissionBytes(data),
	};
}
