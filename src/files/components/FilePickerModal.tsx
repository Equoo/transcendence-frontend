import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { PiArrowUpBold, PiCaretRight, PiCheckBold } from "react-icons/pi";

import CheckButton from "../../components/Button/CheckButton";
import { ModalList, ModalListItem } from "../../components/List/ModalList";
import Modal, { ModalFooter } from "../../components/Modal/Modal";
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
		<Modal
			title={t("files.selectTitle")}
			subtitle={currFolder}
			onClose={onClose}
		>
			<ModalList message={files.length === 0 && t("files.empty")}>
				{currFolder !== "/" && (
					<ModalListItem onClick={goUp}>
						<span className="flex items-center justify-center size-6 shrink-0 rounded-md bg-back2 text-muted">
							<PiArrowUpBold size={12} />
						</span>
						<span className="flex-1 font-semibold text-text2">
							..
						</span>
					</ModalListItem>
				)}
				{folders.map((folder) => (
					<ModalListItem
						key={folder}
						onClick={() => {
							enterFolder(folder);
						}}
					>
						<FolderIcon />
						<span className="flex-1 min-w-0 truncate font-semibold">
							{folder}
						</span>
						<PiCaretRight className="shrink-0 text-muted" />
					</ModalListItem>
				))}
				{rootFiles.map((file) => {
					const selected = selectedKeys.includes(file.key);

					return (
						<ModalListItem
							key={file.key}
							selected={selected}
							onClick={() => {
								onToggle(file.key);
							}}
						>
							<FileIcon contentType={file.contentType} />
							<span className="flex-1 min-w-0 truncate">
								{file.name.slice(currFolder.length)}
							</span>
							{selected && (
								<PiCheckBold
									size={14}
									className="shrink-0 text-accent animate-pop"
								/>
							)}
						</ModalListItem>
					);
				})}
			</ModalList>
			<ModalFooter>
				<CheckButton active activeCheck={false} onClick={onClose}>
					{t("files.selectDone", { count: selectedKeys.length })}
				</CheckButton>
			</ModalFooter>
		</Modal>
	);
}
