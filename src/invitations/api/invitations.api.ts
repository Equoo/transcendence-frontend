import { request, requestJson } from "@/api/request";

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
	return requestJson<string>("/api/auth/invitation", "POST", input);
}

export async function fetchInvitations(): Promise<Invitation[]> {
	return requestJson<Invitation[]>("/api/auth/invitation");
}

export async function deleteInvitation(id: string): Promise<Response> {
	return request(`/api/auth/invitation/${id}`, "DELETE");
}
