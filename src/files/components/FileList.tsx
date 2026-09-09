import List from "../../components/List";
import type { JSX } from "react";
import type { AppFile } from "../api/files.api";
import FileItem from "./FileItem";
import FolderItem from "./FolderItem";
import { useFileBrowser } from "../hooks/useFileBrowser";

export default function FileList({ files }: { files: AppFile[] }): JSX.Element {
	const { currFolder, folders, rootFiles, enterFolder, goUp } =
		useFileBrowser(files);

	return (
		<List
			cols={[
				{ id: "Name" },
				{ id: "Type" },
				{ id: "Size" },
				{ id: "Creator" },
				{ id: "Actions", pos: "text-right" },
			]}
			empty={
				!currFolder && folders.length === 0 && rootFiles.length === 0
			}
			emptyMessage="No files to display."
		>
			{currFolder.length > 0 && <FolderItem name=".." onClick={goUp} />}
			{folders.map((folder) => (
				<FolderItem key={folder} name={folder} onClick={enterFolder} />
			))}
			{rootFiles.map((file) => (
				<FileItem
					key={file.key}
					file={{
						...file,
						name: file.name.slice(currFolder.length),
					}}
				/>
			))}
		</List>
	);
}
