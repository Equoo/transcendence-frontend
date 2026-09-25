import { type JSX, useState } from "react";
import { PiFolderPlus, PiUploadSimple } from "react-icons/pi";

import CheckButton from "@/components/CheckButton";

import List from "../../components/List";
import { type AppFile, listFolders } from "../api/files.api";
import { useFileBrowser } from "../hooks/useFileBrowser";
import FileItem from "./FileItem";
import FileUpload from "./FileUpload";
import FolderItem from "./FolderItem";
import FolderUpload from "./FolderUpload";

export default function FileList({ files }: { files: AppFile[] }): JSX.Element {
	const [showUpload, setShowUpload] = useState(false);
	const [showNewFolder, setShowNewFolder] = useState(false);
	const { currFolder, folders, rootFiles, enterFolder, goUp } =
		useFileBrowser(files);
	const allFolders = listFolders(files);

	return (
		<div className="mt-20">
			<div className="inline-flex w-full justify-between items-end mb-2">
				<p className="font-main text-text2 pl-1.5 text-base font-semibold">
					{currFolder}
				</p>
				<div className="inline-flex gap-2">
					<CheckButton
						className=""
						onClick={() => {
							setShowNewFolder(true);
						}}
					>
						<PiFolderPlus />
						New folder
					</CheckButton>
					<CheckButton
						active
						activeCheck={false}
						className=""
						onClick={() => {
							setShowUpload(true);
						}}
					>
						<PiUploadSimple />
						Upload
					</CheckButton>
				</div>
			</div>
			<List
				cols={[
					{ id: "Name" },
					{ id: "Type" },
					{ id: "Size" },
					{ id: "Actions", pos: "text-right" },
				]}
				empty={
					currFolder === "/" &&
					folders.length === 0 &&
					rootFiles.length === 0
				}
				emptyMessage="No files to display."
			>
				{currFolder !== "/" && <FolderItem name=".." onClick={goUp} />}
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
			{showUpload && (
				<FileUpload
					currentPath={currFolder}
					folders={allFolders}
					onClose={() => {
						setShowUpload(false);
					}}
				/>
			)}
			{showNewFolder && (
				<FolderUpload
					currentPath={currFolder}
					folders={allFolders}
					onClose={() => {
						setShowNewFolder(false);
					}}
				/>
			)}
		</div>
	);
}
