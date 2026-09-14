import { APIError, type ProblemDetail } from "../../api/problem_detail";

export interface RoleInput {
	name: string;
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

export function toRoleInput(formdata: FormData): RoleInput {
	return {
		name: formdata.get("name") as string,
	};
}

export async function fetchRoles(): Promise<Role[]> {
	const res = await fetch("/api/roles");

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}

	const roles = (await res.json()) as Role[];

	return roles;
}

export async function createRole(role: RoleInput): Promise<Response> {
	const res = await fetch("/api/roles", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(role.name),
	});

	return res;
}

export async function deleteRole(id: string): Promise<Response> {
	const res = await fetch(`/api/roles/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});

	return res;
}

export async function changeRoleName(
	id: string,
	name: string,
): Promise<Response> {
	const res = await fetch(`/api/roles/${id}/name`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(name),
	});

	return res;
}
