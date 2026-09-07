/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { APIError, type ProblemDetail } from "../../api/problem_detail";
import type { Perm } from "../components/AdminListRoles";

export interface RoleInput {
	name: string;
}

export interface Role {
	id: string;
	name: string;
	permission: number;
}

export enum PermEnum {
	isAdmin = 1,

	// Event
	HandleEvent = 2,

	// User
	HandleUsers = 4,
	InviteUser = 8,

	// Chat
	HandleChannels = 16,

	// Roles
	HandleRoles = 32,


    
	// Knowledge
	HandleKnowledge = 64,

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

export async function handleCheckbox(
	box: React.MouseEvent<HTMLInputElement>,
	role: Role,
	perm: Perm,
): Promise<Response> {
	let finalCode: number;

	if (box.currentTarget.checked) {
		// eslint-disable-next-line no-multi-assign
		finalCode = role.permission += perm.code;
	} else {
		// eslint-disable-next-line no-multi-assign
		finalCode = role.permission -= perm.code;
	}

	const res = await fetch(`/api/roles/${role.id}/permission`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(toPermInput(finalCode).permission),
	});

	return res;
}
