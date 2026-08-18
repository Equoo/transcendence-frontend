import type { JSX } from "react";

import type { AppFile } from "../api/files.api";
import { useFileBrowser } from "../hooks/useFileBrowser";
import FileItem from "./FileItem";
import FolderItem from "./FolderItem";

export default function FileList({ files }: { files: AppFile[] }): JSX.Element {
	const { currFolder, folders, rootFiles, enterFolder, goUp } =
		useFileBrowser(files);

	return (
		<div className="w-full overflow-x-auto bg-surface rounded-base border border-border">
			<table className="w-full text-sm font-main text-left text-text">
				<thead className="text-sm text-body bg-surface border-b rounded-base border-border">
					<tr>
						<th scope="col" className="px-6 py-3 font-medium">
							Name
						</th>
						<th scope="col" className="px-6 py-3 font-medium">
							Type
						</th>
						<th scope="col" className="px-6 py-3 font-medium">
							Size
						</th>
						<th scope="col" className="py-3 font-medium">
							Creator
						</th>
						<th scope="" className="py-3 font-medium"></th>
					</tr>
				</thead>
				<tbody>
					{currFolder.length > 0 && (
						<FolderItem name=".." onClick={goUp} />
					)}
					{folders.map((folder) => (
						<FolderItem
							key={folder}
							name={folder}
							onClick={enterFolder}
						/>
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
				</tbody>
			</table>
		</div>
	);
}
