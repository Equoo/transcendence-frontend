import { type JSX, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";

import CheckButton from "@/components/Button/CheckButton";
import { Field } from "@/components/Input/Field";
import { Input } from "@/components/Input/Input";
import { Select } from "@/components/Input/Select";
import Modal from "@/components/Modal/Modal";

import { APIError, type ValidationErrors } from "../../api/problem_detail";
import type { clientAction as filesAction } from "../routes/files.route";

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
	const [errors, setErrors] = useState<ValidationErrors>();
	const filesFetcher = useFetcher<typeof filesAction>();
	const destinations = Array.from(new Set(["/", currentPath, ...folders]));

	useEffect(() => {
		if (filesFetcher.data) {
			if (filesFetcher.data instanceof APIError) {
				// eslint-disable-next-line @eslint-react/set-state-in-effect
				setErrors(filesFetcher.data.problem.errors);
			} else {
				onClose();
			}
		}
	}, [filesFetcher.data, onClose]);
	return (
		<Modal title={t("files.newFolder")} onClose={onClose}>
			<filesFetcher.Form
				action="/files"
				method="POST"
				encType="multipart/form-data"
				className="flex flex-col items-center w-4/5 gap-5 mb-4"
				onSubmit={(event) => {
					event.preventDefault();
					const form = new FormData(event.currentTarget);
					const folder = form.get("Folder") as string;
					const name = form.get("Name") as string;
					const formData = new FormData();
					formData.append("Name", `${folder}${name}/`);
					formData.append("File", new File([], name));
					void filesFetcher.submit(formData, {
						action: "/files",
						method: "POST",
						encType: "multipart/form-data",
					});
				}}
			>
				<Input
					maxLength={100}
					name="Name"
					label={t("common.name")}
					required
					pattern="^[^\/]*$"
					title={t("files.noSlash")}
					errors={errors}
				/>
				<Field name="Folder" label={t("files.folder")} required>
					<Select
						name="Folder"
						defaultValue={currentPath}
						className="w-full"
						options={destinations.map((folder) => ({
							value: folder,
							label: folder,
						}))}
					/>
				</Field>
				<CheckButton
					type="submit"
					pending={filesFetcher.state !== "idle"}
				>
					{t("files.newFolderButton")}
				</CheckButton>
			</filesFetcher.Form>
		</Modal>
	);
}
