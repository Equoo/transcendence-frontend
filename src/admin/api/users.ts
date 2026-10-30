import { request } from "@/api/request";

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

	return request(`/api/auth/logout/${req.Id}`, "DELETE");
}

export async function resetPassword(formdata: FormData): Promise<Response> {
	const req = toResetInput(formdata);

	return request(`/api/auth/${req.Id}/password`, "PATCH", req.Password);
}

export async function handleRemoveUser(formdata: FormData): Promise<Response> {
	const req = toUserId(formdata);

	return request(`/api/users/${req.Id}`, "DELETE");
}

export async function handleChange(formdata: FormData): Promise<Response> {
	const req = toChangeRole(formdata);

	return request(`/api/users/${req.UserId}/role/${req.RoleId}`, "PATCH");
}
