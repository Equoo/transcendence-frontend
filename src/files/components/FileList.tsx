import { useState, type JSX } from "react";
import type { AppFile } from "../api/files.api";
import FileItem from "./FileItem";
import FolderItem from "./FolderItem";

export default function FileList({ files }: { files: AppFile[] }): JSX.Element {
	const [currFolder, setCurrFolder] = useState("");

	const folders = Array.from(
		new Set(
			(JSON.parse(JSON.stringify(files)) as AppFile[])
				.filter((file) => {
					if (!file.name.startsWith(currFolder)) {
						return false;
					}
					file.name = file.name.slice(currFolder.length);
					if (!file.name.includes("/")) {
						return false;
					}
					[file.name] = file.name.split("/");
					return true;
				})
				.map((file) => file.name),
		),
	);

	const rootFiles = (JSON.parse(JSON.stringify(files)) as AppFile[]).filter(
		(file) => {
			if (!file.name.startsWith(currFolder)) {
				return false;
			}
			file.name = file.name.substring(currFolder.length);
			if (file.name.includes("/")) {
				return false;
			}
			return true;
		},
	);

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
						<FolderItem
							name=".."
							onClick={() => {
								setCurrFolder(
									currFolder.substring(
										0,
										currFolder.lastIndexOf(
											"/",
											currFolder.length - 2,
										) + 1,
									),
								);
							}}
						/>
					)}
					{folders.map((folder) => (
						<FolderItem
							key={folder}
							name={folder}
							onClick={(name) => {
								setCurrFolder(`${currFolder}${name}/`);
							}}
						/>
					))}
					{rootFiles.map((file) => (
						<FileItem key={file.key} file={file} />
					))}
				</tbody>
			</table>
		</div>
	);
}
