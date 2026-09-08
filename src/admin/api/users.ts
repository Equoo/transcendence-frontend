import { APIError, type ProblemDetail } from "../../api/problem_detail";
import type { User } from "../../users/api/users.api";

export async function fetchUsers(): Promise<User[]> {
	const res = await fetch("/api/users");

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
	const users = (await res.json()) as User[];
	return users;
}

export async function handleDisconnect(id: string): Promise<Response> {
	const res = await fetch(`/api/auth/logout/${id}`, {
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

interface resetInput {
	id: string;
	password: string;
}

function toResetInput(formData: FormData): resetInput {
	return {
		id: formData.get("id") as string,
		password: formData.get("password") as string,
	};
}

export async function resetPassword(formdata: FormData): Promise<Response> {
	const object = toResetInput(formdata);

	const res = await fetch(`/api/auth/${object.id}/password`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(object.password),
	});

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}

	return res;
}

export async function handleRemoveUser(id: string): Promise<Response> {
	const res = await fetch(`/api/users/${id}`, {
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

export async function handleChange(
	UserId: string,
	RoleId: string,
): Promise<Response> {
	const res = await fetch(`/api/users/${UserId}/role/${RoleId}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		// eslint-disable-next-line no-await-in-loop
		throw new APIError((await res.json()) as ProblemDetail);
	}

	return res;
}
