import { request, requestJson } from "@/api/request";
import type { User } from "@/users/api/users";

export enum RelationshipState {
	PendingRequest = 0,
	PendingResponse = 1,
	Friend = 2,
	Blocked = 3
}

export interface Relationship {
	id: string;
	user: User;
	nickName: string;
	since: Date;
	type: RelationshipState;
}

export async function fetchRelationships(): Promise<Relationship[]> {
	const friends = await requestJson<Relationship[]>("/api/me/relationships");

	return friends;
}

export async function addFriend(id: string): Promise<Relationship> {
	return requestJson<Relationship>("/api/me/relationships", "POST", id);
}

export async function removeFriend(id: string): Promise<void> {
	await request(`/api/me/relationships/${id}`, "DELETE");
}

export async function renameSomeone(id: string, nickName: string): Promise<Relationship> {
	return requestJson<Relationship>(
		`/api/me/relationships/${id}`,
		"PATCH",
		nickName,
	);
}
