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
	nickname: string | null;
	since: Date;
	type: RelationshipState;
}

function normalizeRelationship(rel: Relationship): Relationship {
	return { ...rel, since: new Date(rel.since) };
}

export async function fetchRelationships(): Promise<Relationship[]> {
	const rels = await requestJson<Relationship[]>("/api/me/relationships");
	return rels.map(normalizeRelationship);
}

export async function addFriend(userId: string): Promise<Relationship> {
	return normalizeRelationship(
		await requestJson<Relationship>(`/api/me/relationships/${userId}`, "POST"),
	);
}

export async function removeFriend(userId: string): Promise<void> {
	await request(`/api/me/relationships/${userId}`, "DELETE");
}

export async function blockUser(userId: string): Promise<Relationship> {
	return normalizeRelationship(
		await requestJson<Relationship>(`/api/me/relationships/${userId}/block`, "POST"),
	);
}

export async function renameSomeone(userId: string, nickname: string | null): Promise<Relationship> {
	return normalizeRelationship(
		await requestJson<Relationship>(
			`/api/me/relationships/${userId}`,
			"PATCH",
			{ nickname },
		),
	);
}
