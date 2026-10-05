import callApi from "@/tokens/callApi";

import { APIError, type ProblemDetail } from "../../api/problem_detail";

// Interface API

export interface reqUserId {
	Id: string;
}

interface reqResetInput {
	Id: string;
	Password: string;
}

interface reqChangeRole {
	UserId: string;
	RoleId: string;
}

// Function Interface

export function toUserId(formdata: FormData): reqUserId {
	return {
		Id: formdata.get("id") as string,
	};
}

function toResetInput(formData: FormData): reqResetInput {
	return {
		Id: formData.get("id") as string,
		Password: formData.get("password") as string,
	};
}

function toChangeRole(formData: FormData): reqChangeRole {
	return {
		UserId: formData.get("UserId") as string,
		RoleId: formData.get("RoleId") as string,
	};
}

// Function API

export async function handleDisconnect(formdata: FormData): Promise<Response> {
	const req = toUserId(formdata);

	const res = await callApi(`/api/auth/logout/${req.Id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}

	return res;
}

export async function resetPassword(formdata: FormData): Promise<Response> {
	const req = toResetInput(formdata);

	const res = await callApi(`/api/auth/${req.Id}/password`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(req.Password),
	});

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}

	return res;
}

export async function handleRemoveUser(formdata: FormData): Promise<Response> {
	const req = toUserId(formdata);

	const res = await callApi(`/api/users/${req.Id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}

	return res;
}

export async function handleChange(formdata: FormData): Promise<Response> {
	const req = toChangeRole(formdata);

	const res = await callApi(`/api/users/${req.UserId}/role/${req.RoleId}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}

	return res;
}
