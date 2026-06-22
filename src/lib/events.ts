export interface EventData {
	id: string;
	name: string;
	date: string;
	size: number;
	location: string;
	tags: string[];
	description?: string;
}

export interface EventInput {
	name: string;
	date: string;
	size: number;
	location: string;
	tags: string[];
	description?: string;
}

export type EventActionResult =
	| { ok: true; event: EventData }
	| { ok: false; error: string };

function splitTags(tags: string): string[] {
	if (!tags.trim()) {
		return [];
	}
	return tags.trim().split(/\s+/u);
}

function toEventInput(formData: FormData): EventInput {
	return {
		name: formData.get("name") as string,
		date: formData.get("date") as string,
		size: Number(formData.get("size")),
		location: formData.get("location") as string,
		tags: splitTags(formData.get("tags") as string),
		description: formData.get("description") as string,
	};
}

export async function fetchEvents(): Promise<EventData[]> {
	const response = await fetch("/api/events");
	if (!response.ok) {
		throw new Error("Can't fetch events");
	}

	return (await response.json()) as EventData[];
}

export async function createEvent(
	formData: FormData,
): Promise<EventActionResult> {
	const object = toEventInput(formData);

	const response = await fetch("/api/events", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(object),
	});

	if (!response.ok) {
		return {
			ok: false,
			error: "Event creation failed.",
		};
	}

	return {
		ok: true,
		event: (await response.json()) as EventData,
	};
}
