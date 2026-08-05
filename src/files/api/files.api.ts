import { APIError, type ProblemDetail } from "../../api/problem_detail";

import type { User } from "../../api/users";

export interface AppFile {
	key: string;
	name: string;
	length: number;
	etag: string;
	contentType: string;
	lastUpdated: string;
	creator: User;
}

export interface FileInput {
	name: string;
	file: File;
}

export function toFileInput(formData: FormData): FileInput {
	return {
		name: formData.get("Name") as string,
		file: formData.get("File") as File,
	};
}

export async function createFile(data: FormData): Promise<Response> {
	const res = await fetch("/api/files", {
		method: "POST",
		body: data,
	});

	return res;
}

export async function fetchFiles(): Promise<AppFile[]> {
	const res = await fetch("/api/files");

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
	const files = (await res.json()) as AppFile[];
	files.sort((fileA, fileB) => fileA.name.localeCompare(fileB.name));
	return files;
}
