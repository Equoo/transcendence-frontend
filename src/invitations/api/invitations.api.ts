import { APIError, type ProblemDetail } from "../../api/problem_detail";

export interface Invitation {
	id: string;
	expiresAt: string;
	usages: number;
}

export interface InvitationInput {
	expiresAt: string;
	usages: number;
}

export function toInvitationInput(formData: FormData): InvitationInput {
	return {
		expiresAt: formData.get("Expires At") as string,
		usages: Number(formData.get("Usages")),
	};
}

export async function createInvitation(
	input: InvitationInput,
): Promise<string> {
	const res = await fetch("/api/auth/invitation", {
		method: "POST",
		body: JSON.stringify(input),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}

	return res.json();
}

export async function fetchInvitations(): Promise<Invitation[]> {
	const res = await fetch("/api/auth/invitation");

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}

	return (await res.json()) as Invitation[];
}

export async function deleteInvitation(id: string): Promise<Response> {
	const res = await fetch(`/api/auth/invitation/${id}`, {
		method: "DELETE",
	});

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
	return res;
}
