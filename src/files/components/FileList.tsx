import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiFolderPlus, PiUploadSimple } from "react-icons/pi";

import CheckButton from "@/components/Button/CheckButton";

import List from "../../components/List/List";
import { type AppFile, listFolders } from "../api/files.api";
import { useFileBrowser } from "../hooks/useFileBrowser";
import FileItem from "./FileItem";
import FileUpload from "./FileUpload";
import FolderItem from "./FolderItem";
import FolderUpload from "./FolderUpload";

export default function FileList({ files }: { files: AppFile[] }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [showUpload, setShowUpload] = useState(false);
	const [showNewFolder, setShowNewFolder] = useState(false);
	const { currFolder, folders, rootFiles, enterFolder, goUp } =
		useFileBrowser(files);
	const allFolders = listFolders(files);

	return (
		<div className="mt-20">
			<div className="flex flex-wrap w-full justify-between items-end gap-2 mb-2">
				<p className="font-main text-text2 pl-1.5 text-base font-semibold min-w-0 truncate">
					{currFolder}
				</p>
				<div className="inline-flex shrink-0 gap-2">
					<CheckButton
						className=""
						onClick={() => {
							setShowNewFolder(true);
						}}
					>
						<PiFolderPlus />
						{t("files.newFolder")}
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
						{t("common.upload")}
					</CheckButton>
				</div>
			</div>
			<List
				cols={[
					{ id: t("common.name") },
					{ id: t("files.type") },
					{ id: t("files.size") },
					{ id: t("common.actions"), pos: "text-right" },
				]}
				empty={
					currFolder === "/" &&
					folders.length === 0 &&
					rootFiles.length === 0
				}
				emptyMessage={t("files.empty")}
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
