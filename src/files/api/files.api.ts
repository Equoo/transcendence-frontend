import i18n from "i18next";

import { APIError, type ProblemDetail } from "@/api/problem_detail";
import { request, requestJson } from "@/api/request";
import callApi from "@/tokens/callApi";

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
	const res = await callApi("/api/files", {
		method: "POST",
		body: data,
	});

	return res;
}

export async function uploadChatImage(
	channelId: string,
	file: File,
): Promise<AppFile> {
	const body = new FormData();
	body.set("Name", `chat_${channelId}_${file.name}`.slice(0, 255));
	body.set("File", file);

	const res = await createFile(body);
	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
	return (await res.json()) as AppFile;
}

export async function downloadFile(key: string): Promise<Blob> {
	const res = await request(`/api/files/${key}`);
	return res.blob();
}

export async function fetchFile(key: string): Promise<AppFile> {
	return requestJson<AppFile>(`/api/files/meta/${key}`);
}

export async function fetchFiles(): Promise<AppFile[]> {
	const files = await requestJson<AppFile[]>("/api/files");
	files.sort((fileA, fileB) => fileA.name.localeCompare(fileB.name));
	return files;
}

export async function deleteFile(key: string): Promise<Response> {
	return request(`/api/files/${key}`, "DELETE");
}

export async function updateFileName(
	key: string,
	name: string,
): Promise<Response> {
	return request(`/api/files/${key}/name`, "PATCH", { name });
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

export function splitFileName(name: string): {
	folder: string;
	baseName: string;
} {
	const slash = name.lastIndexOf("/");
	return {
		folder: name.slice(0, slash + 1),
		baseName: name.slice(slash + 1),
	};
}

export function getRecentFiles(files: AppFile[], limit: number): AppFile[] {
	return files
		.filter(
			(file) =>
				file.name.at(0) === "/" &&
				file.name.at(file.name.length - 1) !== "/",
		)
		.toSorted((fileA, fileB) =>
			fileB.lastUpdated.localeCompare(fileA.lastUpdated),
		)
		.slice(0, limit);
}

export async function renameFolder(
	from: string,
	to: string,
): Promise<Response> {
	if (to.startsWith(from)) {
		throw new Error(i18n.t("files.cannotMoveIntoItself"));
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
