import type { ProblemDetail } from "../../api/problem_detail";
import type { APIResult } from "../../api/results";
import type { User } from "../../api/users";

export interface APIFile {
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
}

export async function fetchFiles(): Promise<APIResult<APIFile[]>> {
	const res = await fetch("/api/files");

	if (!res.ok) {
		return { ok: false, prob: (await res.json()) as ProblemDetail };
	}
	const files = (await res.json()) as APIFile[];
	files.sort((fileA, fileB) => fileA.name.localeCompare(fileB.name));
	return { ok: true, res: files };
}
