import { useState } from "react";

import type { EventData } from "../../api/events.api";
import { REQUIRED_FIELDS, type RequiredField } from "./Slot";

export interface EventDraft {
	name: string;
	location: string;
	date: string;
	size: string;
	tags: string[];
	roles: string[];
	description: string;
	fileKeys: string[];
}

function initialDraft(event?: EventData): EventDraft {
	if (!event) {
		return {
			name: "",
			location: "",
			date: "",
			size: "",
			tags: [],
			roles: [],
			description: "",
			fileKeys: [],
		};
	}
	return {
		name: event.name,
		location: event.location,
		date: event.date.substring(0, event.date.lastIndexOf(":")),
		size: String(event.size),
		tags: event.tags,
		roles: event.eventRoles.map((role) => role.name),
		description: event.description ?? "",
		fileKeys: event.files.map((file) => file.key),
	};
}

export function useEventDraft(event?: EventData): {
	draft: EventDraft;
	update: <K extends keyof EventDraft>(key: K, value: EventDraft[K]) => void;
	filled: Record<RequiredField, boolean>;
	missing: RequiredField[];
} {
	const [draft, setDraft] = useState(() => initialDraft(event));

	function update<K extends keyof EventDraft>(
		key: K,
		value: EventDraft[K],
	): void {
		setDraft((prev) => ({ ...prev, [key]: value }));
	}

	const filled: Record<RequiredField, boolean> = {
		name: draft.name.trim() !== "",
		location: draft.location.trim() !== "",
		date: draft.date !== "",
		size: Number(draft.size) >= 1,
	};

	return {
		draft,
		update,
		filled,
		missing: REQUIRED_FIELDS.filter((field) => !filled[field]),
	};
}
