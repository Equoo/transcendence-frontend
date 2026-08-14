import { useState } from "react";
import type { AppFile } from "../api/files.api";

export function useFileBrowser(files: AppFile[]): {
	currFolder: string;
	folders: string[];
	rootFiles: AppFile[];
	enterFolder: (name: string) => void;
	goUp: () => void;
} {
	const [currFolder, setCurrFolder] = useState("");

	const folders = Array.from(
		new Set(
			files
				.filter((file) => file.name.startsWith(currFolder))
				.map((file) => file.name.slice(currFolder.length))
				.filter((rest) => rest.includes("/"))
				.map((rest) => rest.split("/")[0]),
		),
	);

	const rootFiles = files.filter((file) => {
		if (!file.name.startsWith(currFolder)) {
			return false;
		}
		return !file.name.slice(currFolder.length).includes("/");
	});

	function enterFolder(name: string): void {
		setCurrFolder((prev) => `${prev}${name}/`);
	}

	function goUp(): void {
		setCurrFolder((prev) =>
			prev.substring(0, prev.lastIndexOf("/", prev.length - 2) + 1),
		);
	}

	return { currFolder, folders, rootFiles, enterFolder, goUp };
}
