import { request, requestJson } from "@/api/request";

export interface Invitation {
	id: string;
	expireAt: string;
	usages: number;
}

export interface InvitationInput {
	expireAt: string;
	usages: number;
}

export function toInvitationInput(formData: FormData): InvitationInput {
	const res = {
		expireAt: new Date(formData.get("Expires At") as string).toISOString(),
		usages: Number(formData.get("Usages")),
	};

	if ((formData.get("Permanent") as string) === "on") {
		res.usages = -1;
		res.expireAt = new Date().toJSON();
	}
	return res;
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
