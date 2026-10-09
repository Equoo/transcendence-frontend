import { request, requestJson } from "@/api/request";
import type { ChannelSummary } from "@/chat/api/chat.api";

import type { AppFile } from "../../files/api/files.api";
import type { User } from "../../users/api/users";
import type { EventRole } from "./event_roles.api";
import type { Registration } from "./registrations.api";

export interface EventData {
	id: string;
	name: string;
	date: string;
	size: number;
	location: string;
	tags: string[];
	description?: string;
	organizer: User;
	eventRoles: EventRole[];
	registrations: Registration[];
	files: AppFile[];
	registeredCount: number;
	isRegistered: boolean;
	channel: ChannelSummary;
}

export interface EventSummary {
	id: string;
	name: string;
	date: string;
	size: number;
	location: string;
	tags: string[];
	eventRoles: EventRole[];
	registeredCount: number;
	isRegistered: boolean;
}

export interface EventInput {
	name: string;
	date: string;
	size: number;
	location: string;
	tags: string[];
	eventRoleIds: string[];
	fileKeys: string[];
	description: string;
}

export function toEventInput(formData: FormData): EventInput {
	return {
		name: formData.get("Name") as string,
		date: formData.get("Date") as string,
		size: Number(formData.get("Size")),
		location: formData.get("Location") as string,
		tags: formData.getAll("Tags") as string[],
		eventRoleIds: formData.getAll("Roles") as string[],
		fileKeys: formData.getAll("Files") as string[],
		description: formData.get("Description") as string,
	};
}

export async function fetchEvents(): Promise<EventSummary[]> {
	const events = await requestJson<EventSummary[]>("/api/events");
	events.sort((evA, evB) => evA.date.localeCompare(evB.date));
	return events;
}

export async function fetchEvent(id: string): Promise<EventData> {
	return requestJson<EventData>(`/api/events/${id}`);
}

export async function createEvent(event: EventInput): Promise<EventData> {
	return requestJson<EventData>("/api/events", "POST", event);
}

export async function updateEvent(
	event: EventInput,
	id: string,
): Promise<Response> {
	return request(`/api/events/${id}`, "PUT", event);
}

export async function deleteEvent(id: string): Promise<Response> {
	return request(`/api/events/${id}`, "DELETE");
}
