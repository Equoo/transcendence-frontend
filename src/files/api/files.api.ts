import { APIError, type ProblemDetail } from "../../api/problem_detail";

export interface AppFile {
	key: string;
	name: string;
	length: number;
	etag: string;
	contentType: string;
	lastUpdated: string;
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

export async function downloadFile(key: string): Promise<Blob> {
	const res = await fetch(`/api/files/${key}`);

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
	return res.blob();
}

export async function fetchFile(key: string): Promise<AppFile> {
	const res = await fetch(`/api/files/meta/${key}`);
	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
	return (await res.json()) as AppFile;
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

export async function deleteFile(key: string): Promise<Response> {
	const res = await fetch(`/api/files/${key}`, { method: "DELETE" });

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
	return res;
}

export async function updateFileName(
	key: string,
	name: string,
): Promise<Response> {
	const res = await fetch(`/api/files/${key}/name`, {
		method: "PATCH",
		body: JSON.stringify({ name }),
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
	return res;
}

export function listFolders(files: AppFile[]): string[] {
	const folders = new Set<string>();
	for (const file of files) {
		let idx = file.name.indexOf("/");
		while (idx !== -1) {
			folders.add(file.name.slice(0, idx + 1));
			idx = file.name.indexOf("/", idx + 1);
		}
	}
	return Array.from(folders).sort((folderA, folderB) =>
		folderA.localeCompare(folderB),
	);
}

export async function renameFolder(
	from: string,
	to: string,
): Promise<Response> {
	if (to.startsWith(from)) {
		throw new Error("Cannot move a folder into itself");
	}
	const files = await fetchFiles();
	await Promise.all(
		files
			.filter((file) => file.name.startsWith(from))
			.map(async (file) =>
				updateFileName(file.key, to + file.name.slice(from.length)),
			),
	);
	return new Response(null, { status: 204 });
}

export async function deleteFolder(folder: string): Promise<Response> {
	const files = await fetchFiles();
	await Promise.all(
		files
			.filter((file) => file.name.startsWith(folder))
			.map(async (file) => deleteFile(file.key)),
	);
	return new Response(null, { status: 204 });
}
