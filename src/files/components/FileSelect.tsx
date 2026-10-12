import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { FcFolder } from "react-icons/fc";
import { PiCheck } from "react-icons/pi";

import type { ValidationErrors } from "../../api/problem_detail";
import Badge from "../../components/Badge";
import CheckButton from "../../components/Button/CheckButton";
import { Field } from "../../components/Input/Field";
import HiddenValues from "../../components/Input/HiddenValues";
import Modal from "../../components/Modal/Modal";
import type { AppFile } from "../api/files.api";
import { useFileBrowser } from "../hooks/useFileBrowser";

export default function FileSelect({
	files,
	selectedKeys,
	name,
	label,
	required,
	errors,
}: {
	files: AppFile[];
	selectedKeys?: string[];
	name: string;
	label?: string;
	required?: boolean;
	errors?: ValidationErrors;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [showSelect, setShowSelect] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState<string[]>(
		selectedKeys ?? [],
	);
	const { currFolder, folders, rootFiles, enterFolder, goUp } =
		useFileBrowser(files);

	function toggleSelected(fileKey: string): void {
		setSelectedFiles((oldSelectedFiles) =>
			oldSelectedFiles.includes(fileKey)
				? oldSelectedFiles.filter(
						(selectedFile) => selectedFile !== fileKey,
					)
				: [...oldSelectedFiles, fileKey],
		);
	}

	return (
		<Field name={name} label={label} required={required} errors={errors}>
			<div className="relative flex flex-wrap items-center gap-1 w-full bg-surface border rounded-md border-border2 focus-within:border-accent px-2 py-1 font-main text-text">
				{selectedFiles.map((selectedFileKey) => {
					const selectedFile = files.find(
						(file) => file.key === selectedFileKey,
					);
					const fileLabel =
						selectedFile?.name.substring(
							selectedFile.name.lastIndexOf("/") + 1,
						) ?? selectedFileKey;

					return (
						<Badge key={selectedFileKey}>
							{fileLabel}
							<button
								type="button"
								className="font-bold text-text cursor-pointer"
								onClick={() => {
									toggleSelected(selectedFileKey);
								}}
							>
								x
							</button>
						</Badge>
					);
				})}
				<button
					type="button"
					className="text-text hover:cursor-pointer"
					onClick={() => {
						setShowSelect(true);
					}}
				>
					{selectedFiles.length > 0
						? t("files.add")
						: t("files.selectFiles")}
				</button>
			</div>
			<HiddenValues name={name} values={selectedFiles} />
			{showSelect && (
				<Modal
					title={t("files.selectTitle")}
					onClose={() => {
						setShowSelect(false);
					}}
				>
					{files.length > 0 && (
						<div className="w-full flex flex-col bg-surface rounded p-2">
							{currFolder !== "/" && (
								<div
									className="inline-flex items-center gap-2 rounded p-2 hover:bg-surface2 hover:cursor-pointer"
									onClick={goUp}
								>
									<FcFolder size={22} />
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
									<FcFolder size={22} />
									<p className="text-lg font-medium">
										{folder}
									</p>
								</div>
							))}
							{rootFiles.map((file) => (
								<div
									key={file.key}
									className={`inline-flex items-center gap-2 rounded p-2 hover:cursor-pointer hover:bg-surface2 ${
										selectedFiles.includes(file.key)
											? "bg-surface"
											: ""
									}`}
									onClick={() => {
										toggleSelected(file.key);
									}}
								>
									{selectedFiles.includes(file.key) && (
										<PiCheck size={20} />
									)}
									<p
										className={`${selectedFiles.includes(file.key) || "pl-7"} text-lg font-medium text-text`}
									>
										{file.name.slice(currFolder.length)}
									</p>
								</div>
							))}
						</div>
					)}
					<CheckButton
						active
						type="button"
						onClick={() => {
							setShowSelect(false);
						}}
					>
						{t("common.ok")}
					</CheckButton>
				</Modal>
			)}
		</Field>
	);
}
