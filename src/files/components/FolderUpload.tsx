import { type JSX, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiFolderPlus } from "react-icons/pi";
import { useFetcher } from "react-router";

import CheckButton from "@/components/Button/CheckButton";
import { Input } from "@/components/Input/Input";
import Modal, { ModalFooter } from "@/components/Modal/Modal";

import {
	APIError,
	otherErrors,
	validationErrors,
} from "../../api/problem_detail";
import type { clientAction as filesAction } from "../routes/files.route";
import FolderPicker from "./FolderPicker";

const NAME_MAX_LENGTH = 100;

export default function FolderUpload({
	onClose,
	currentPath = "/",
	folders,
}: {
	onClose: () => void;
	currentPath?: string;
	folders: string[];
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const fetcher = useFetcher<typeof filesAction>();
	const [name, setName] = useState("");
	const [folder, setFolder] = useState(currentPath);
	const destinations = Array.from(new Set(["/", currentPath, ...folders]));

	const errors = validationErrors(fetcher.data);
	const ready = name.trim() !== "" && !name.includes("/");

	useEffect(() => {
		if (
			fetcher.state === "idle" &&
			fetcher.data &&
			!(fetcher.data instanceof APIError)
		) {
			onClose();
		}
	}, [fetcher.state, fetcher.data, onClose]);

	return (
		<Modal
			title={t("files.newFolder")}
			subtitle={t("files.newFolderHint")}
			highlight={ready}
			onClose={onClose}
		>
			<form
				className="contents"
				onSubmit={(ev) => {
					ev.preventDefault();
					if (!ready) {
						return;
					}
					const formData = new FormData();
					formData.append("Name", `${folder}${name.trim()}/`);
					formData.append("File", new File([], name.trim()));
					void fetcher.submit(formData, {
						action: "/files",
						method: "POST",
						encType: "multipart/form-data",
					});
				}}
			>
				<div className="flex flex-col gap-4">
					<Input
						autoFocus
						name="Name"
						value={name}
						maxLength={NAME_MAX_LENGTH}
						label={t("common.name")}
						placeholder={t("files.folderNamePlaceholder")}
						errors={
							name.includes("/")
								? { ...errors, Name: [t("files.noSlash")] }
								: errors
						}
						onChange={(ev) => {
							setName(ev.target.value);
						}}
					/>
					<FolderPicker
						label={t("files.folder")}
						folders={destinations}
						value={folder}
						onChange={setFolder}
					/>
				</div>
				<ModalFooter errors={otherErrors(errors, ["Name"])}>
					<CheckButton
						type="submit"
						active={ready}
						activeCheck={false}
						pending={fetcher.state !== "idle"}
					>
						{ready ? (
							<>
								<PiFolderPlus className="animate-pop" />
								{t("files.newFolderButton")}
							</>
						) : (
							<span className="text-text2">
								{name.includes("/")
									? t("files.noSlash")
									: t("files.nameFolderFirst")}
							</span>
						)}
					</CheckButton>
				</ModalFooter>
			</form>
		</Modal>
	);
}
