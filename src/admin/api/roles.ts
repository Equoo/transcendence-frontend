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
	GetUser = 4,
	InviteUser = 8,
	ChangeUsername = 16,
	DeleteUser = 32,
	ResetUserPassword = 64,

	// Chat
	HandleChannel = 128,

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

