import { requestJson } from "@/api/request";

export interface EventRole {
	id: string;
	name: string;
}

export interface EventRoleInput {
	name: string;
}

export async function createEventRole(reg: EventRoleInput): Promise<EventRole> {
	return requestJson<EventRole>("/api/events/roles", "POST", reg);
}

export async function fetchEventRoles(): Promise<EventRole[]> {
	return requestJson<EventRole[]>("/api/events/roles");
}
