/* eslint-disable no-bitwise */
import callApi from "@/tokens/call_api";

import { APIError, type ProblemDetail } from "../../api/problem_detail";
import { toUserId } from "./users";

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

export interface Role {
	id: string;
	name: string;
	permission: number;
}

// Interface API

interface reqCreateRole {
	name: string;
}

interface reqCheckRole {
	IsChecked: string;
	RoleId: string;
	RolePerm: number;
	CheckPerm: number;
}

interface reqChangeRole {
	Id: string;
	Name: string;
}

interface PermInput {
	permission: number;
}

// Function Interface

function toChangeRole(formdata: FormData): reqChangeRole {
	return {
		Id: formdata.get("id") as string,
		Name: formdata.get("name") as string,
	};
}

function toCheckRole(formdata: FormData): reqCheckRole {
	return {
		IsChecked: formdata.get("IsChecked") as string,
		RoleId: formdata.get("RoleId") as string,
		RolePerm: Number(formdata.get("RolePerm")),
		CheckPerm: Number(formdata.get("CheckPerm")),
	};
}

function toRoleInput(formdata: FormData): reqCreateRole {
	return {
		name: formdata.get("name") as string,
	};
}

function toPermInput(perm: number): PermInput {
	return { permission: perm };
}

// Function API

export async function fetchRoles(): Promise<Role[]> {
	const res = await callApi("/api/roles");

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}

	const roles = (await res.json()) as Role[];

	return roles;
}

export async function createRole(formdata: FormData): Promise<Response> {
	const req = toRoleInput(formdata);

	const res = await callApi("/api/roles", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(req.name),
	});

	return res;
}

export async function deleteRole(formdata: FormData): Promise<Response> {
	const req = toUserId(formdata);

	const res = await callApi(`/api/roles/${req.Id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});

	return res;
}

export async function changeRoleName(formdata: FormData): Promise<Response> {
	const req = toChangeRole(formdata);

	const res = await callApi(`/api/roles/${req.Id}/name`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(req.Name),
	});

	return res;
}

export async function handleCheckbox(formdata: FormData): Promise<Response> {
	const req: reqCheckRole = toCheckRole(formdata);

	let finalCode: number;

	if (req.IsChecked === "true") {
		finalCode = req.RolePerm | req.CheckPerm;
	} else {
		finalCode = req.RolePerm & ~req.CheckPerm;
	}

	const res = await callApi(`/api/roles/${req.RoleId}/permission`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(toPermInput(finalCode).permission),
	});
	return res;
}
