import { type JSX, useEffect, useState } from "react";
import { useFetcher } from "react-router";

import { APIError, type ValidationErrors } from "../../api/problem_detail";
import CheckButton from "../../components/CheckButton";
import { Field } from "../../components/Field";
import { Input } from "../../components/Input";
import Modal from "../../components/Modal";
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
		<Modal title="New folder" onClose={onClose}>
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
					required
					pattern="[^\/]"
					title="Must not contain /"
					errors={errors}
				/>
				<Field name="Folder" required>
					<select
						name="Folder"
						required
						defaultValue={currentPath}
						className="w-full bg-surface border rounded-md border-border2 focus:border-accent px-2 py-1 font-main text-text"
					>
						{destinations.map((folder) => (
							<option key={folder} value={folder}>
								{folder}
							</option>
						))}
					</select>
				</Field>
				<CheckButton
					type="submit"
					pending={filesFetcher.state !== "idle"}
				>
					New Folder
				</CheckButton>
			</filesFetcher.Form>
		</Modal>
	);
}
