import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { PiCheck } from "react-icons/pi";

import CheckButton from "../../components/Button/CheckButton";
import Modal from "../../components/Modal/Modal";
import type { AppFile } from "../api/files.api";
import { useFileBrowser } from "../hooks/useFileBrowser";
import { FileIcon, FolderIcon } from "./FileIcon";

export default function FilePickerModal({
	files,
	selectedKeys,
	onToggle,
	onClose,
}: {
	files: AppFile[];
	selectedKeys: string[];
	onToggle: (fileKey: string) => void;
	onClose: () => void;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const { currFolder, folders, rootFiles, enterFolder, goUp } =
		useFileBrowser(files);

	return (
		<Modal title={t("files.selectTitle")} onClose={onClose}>
			{files.length > 0 && (
				<div className="w-full flex flex-col bg-surface rounded p-2">
					{currFolder !== "/" && (
						<div
							className="inline-flex items-center gap-2 rounded p-2 hover:bg-surface2 hover:cursor-pointer"
							onClick={goUp}
						>
							<FolderIcon />
							<p className="text-lg font-medium">..</p>
						</div>
					)}
					{folders.map((folder) => (
						<div
							key={folder}
							className="inline-flex items-center gap-2 rounded p-2 hover:bg-surface2 hover:cursor-pointer"
							onClick={() => {
								enterFolder(folder);
							}}
						>
							<FolderIcon />
							<p className="text-lg font-medium">{folder}</p>
						</div>
					))}
					{rootFiles.map((file) => (
						<div
							key={file.key}
							className={`inline-flex items-center gap-2 rounded p-2 hover:cursor-pointer hover:bg-surface2 ${
								selectedKeys.includes(file.key)
									? "bg-surface"
									: ""
							}`}
							onClick={() => {
								onToggle(file.key);
							}}
						>
							<FileIcon contentType={file.contentType} />
							<p className="flex-1 min-w-0 truncate text-lg font-medium text-text">
								{file.name.slice(currFolder.length)}
							</p>
							{selectedKeys.includes(file.key) && (
								<PiCheck size={20} />
							)}
						</div>
					))}
				</div>
			)}
			<CheckButton active type="button" onClick={onClose}>
				{t("common.ok")}
			</CheckButton>
		</Modal>
	);
}
