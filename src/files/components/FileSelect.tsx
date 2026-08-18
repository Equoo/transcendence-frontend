import { type JSX,useState } from "react";
import { FcFolder } from "react-icons/fc";
import { PiCheck } from "react-icons/pi";

import type { ValidationErrors } from "../../api/problem_detail";
import EventBadge from "../../components/Badge";
import CheckButton from "../../components/CheckButton";
import { Field } from "../../components/Field";
import HiddenValues from "../../components/HiddenValues";
import Modal from "../../components/Modal";
import type { AppFile } from "../api/files.api";
import { useFileBrowser } from "../hooks/useFileBrowser";

export default function FileSelect({
	files,
	name,
	required,
	errors,
}: {
	files: AppFile[];
	name: string;
	required?: boolean;
	errors?: ValidationErrors;
}): JSX.Element {
	const [showSelect, setShowSelect] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
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
		<Field name={name} required={required} errors={errors}>
			<div className="relative flex flex-wrap items-center gap-1 w-full bg-surface border rounded-md border-border2 focus-within:border-accent px-2 py-1 font-main text-text">
				{selectedFiles.map((selectedFileKey) => {
					const selectedFile = files.find(
						(file) => file.key === selectedFileKey,
					);
					const label =
						selectedFile?.name.substring(
							selectedFile.name.lastIndexOf("/") + 1,
						) ?? selectedFileKey;

					return (
						<EventBadge key={selectedFileKey}>
							{label}
							<button
								type="button"
								className="font-bold text-text cursor-pointer"
								onClick={() => {
									toggleSelected(selectedFileKey);
								}}
							>
								x
							</button>
						</EventBadge>
					);
				})}
				<button
					type="button"
					className="text-muted hover:text-text"
					onClick={() => {
						setShowSelect(true);
					}}
				>
					{selectedFiles.length > 0 ? "+ Add" : "Select files"}
				</button>
			</div>
			<HiddenValues name={name} values={selectedFiles} />
			{showSelect && (
				<Modal
					title="Select a File"
					onClose={() => {
						setShowSelect(false);
					}}
				>
					<div className="w-full flex flex-col bg-surface rounded p-2">
						{currFolder.length > 0 && (
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
								<p className="text-lg font-medium">{folder}</p>
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
									className={`${selectedFiles.includes(file.key) || "pl-7"} text-lg font-medium`}
								>
									{file.name.slice(currFolder.length)}
								</p>
							</div>
						))}
					</div>
					<CheckButton
						active
						type="button"
						onClick={() => {
							setShowSelect(false);
						}}
					>
						Ok
					</CheckButton>
				</Modal>
			)}
		</Field>
	);
}
