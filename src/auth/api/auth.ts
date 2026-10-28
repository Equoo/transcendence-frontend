// Interface Api

import type { ProblemDetail } from "@/api/problem_detail";
import callApi from "@/tokens/callApi";

export type UserResult =
	{ ok: true } | { ok: false; error: ProblemDetail | undefined };

interface reqLoginInput {
	// username or email, ouais c'est moi qui ai mis le commentaire
	login: string;
	password: string;
}

interface reqRegisterInput {
	username: string;
	email: string;
	password: string;
	invitationCode: string;
}

// Function Interface

function toLoginInput(formData: FormData): reqLoginInput {
	return {
		login: (formData.get("Login") as string).trim(),
		password: formData.get("Password") as string,
	};
}

function toRegisterInput(formData: FormData): reqRegisterInput {
	return {
		username: (formData.get("Username") as string).trim(),
		email: (formData.get("Email") as string).trim(),
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
		return {
			ok: false,
			error: (await response.json()) as ProblemDetail,
		};
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
		return {
			ok: false,
			error: (await res.json()) as ProblemDetail,
		};
	}
	return { ok: true };
}
