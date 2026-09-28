// Interface Api

import callApi from "@/tokens/call_api";

export type UserResult = { ok: true } | { ok: false };

interface reqLoginInput {
	username: string;
	password: string;
}

interface reqRegisterInput {
	username: string;
	password: string;
	invitationCode: string;
}

// Function Interface

function toLoginInput(formData: FormData): reqLoginInput {
	return {
		username: formData.get("Username") as string,
		password: formData.get("Password") as string,
	};
}

function toRegisterInput(formData: FormData): reqRegisterInput {
	return {
		username: formData.get("Username") as string,
		password: formData.get("Password") as string,
		invitationCode: formData.get("Code") as string,
	};
}

// Function API

export async function loginUser(formData: FormData): Promise<UserResult> {
	const req = toLoginInput(formData);

	const response = await callApi("/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(req),
	});
	if (!response.ok) {
		return { ok: false };
	}
	return { ok: true };
}

export async function registerUser(formData: FormData): Promise<UserResult> {
	const req = toRegisterInput(formData);

	const res = await callApi("/api/auth/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(req),
	});

	if (!res.ok) {
		return { ok: false };
	}
	return { ok: true };
}
