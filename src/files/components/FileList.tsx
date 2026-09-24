import type { JSX } from "react";

import List from "../../components/List";
import { type AppFile, listFolders } from "../api/files.api";
import { useFileBrowser } from "../hooks/useFileBrowser";
import FileItem from "./FileItem";
import FolderItem from "./FolderItem";

export default function FileList({ files }: { files: AppFile[] }): JSX.Element {
	const { currFolder, folders, rootFiles, enterFolder, goUp } =
		useFileBrowser(files);
	const allFolders = listFolders(files);

	return (
		<div>
			<p className="font-main absolute top-24 text-text2 pl-1.5 text-base font-semibold">
				/{currFolder}
			</p>
			<List
				cols={[
					{ id: "Name" },
					{ id: "Type" },
					{ id: "Size" },
					{ id: "Actions", pos: "text-right" },
				]}
				empty={
					!currFolder &&
					folders.length === 0 &&
					rootFiles.length === 0
				}
				emptyMessage="No files to display."
			>
				{currFolder.length > 0 && (
					<FolderItem name=".." onClick={goUp} />
				)}
				{folders.map((folder) => (
					<FolderItem
						key={folder}
						name={folder}
						onClick={enterFolder}
						parent={currFolder}
						folders={allFolders}
					/>
				))}
				{rootFiles.map((file) => (
					<FileItem
						key={file.key}
						file={file}
						parent={currFolder}
						folders={allFolders}
					/>
				))}
			</List>
		</div>
	);
}
