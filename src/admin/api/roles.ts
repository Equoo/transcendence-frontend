import { APIError, type ProblemDetail } from "../../api/problem_detail";

export interface RoleInput {
	name: string;
}

export interface Role {
	id: string;
	name: string;
	permission: number;
}

export enum PermEnum {
	// Event
	HandleEvent = 1,

	// User
	HandleUsers = 2,
	InviteUser = 4,

	// Chat
	HandleChannels = 8,

	// Roles
	HandleRoles = 16,


    
	// Knowledge
	HandleKnowledge = 32,

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

interface PermInput {
	permission: number;
}

function toPermInput(perm: number): PermInput {
	return { permission: perm };
}

// eslint-disable-next-line @typescript-eslint/max-params
export async function handleCheckbox(
	IsChecked: string,
	RoleId: string,
	RolePerm: number,
	CheckPerm: number,
): Promise<Response> {
	let finalCode: number;

	if (IsChecked === "true") {
		finalCode = RolePerm + CheckPerm;
	} else {
		finalCode = RolePerm - CheckPerm;
	}

	const res = await fetch(`/api/roles/${RoleId}/permission`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(toPermInput(finalCode).permission),
	});

	return res;
}
