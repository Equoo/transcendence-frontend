import { type JSX, useEffect, useState } from "react";
import { useFetcher } from "react-router";

import { Field } from "@/components/Input/Field";

import { APIError, type ValidationErrors } from "../../api/problem_detail";
import CheckButton from "../../components/Button/CheckButton";
import { Input } from "../../components/Input/Input";
import Modal from "../../components/Modal/Modal";
import type { clientAction as filesAction } from "../routes/files.route";

export default function FileUpload({
	onClose,
	currentPath = "/",
	folders,
}: {
	onClose: () => void;
	currentPath?: string;
	folders: string[];
}): JSX.Element {
	const [errors, setErrors] = useState<ValidationErrors>();
	const [name, setName] = useState("");
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
		<Modal title="Upload a file" onClose={onClose}>
			<filesFetcher.Form
				action="/files"
				method="POST"
				encType="multipart/form-data"
				className="flex flex-col items-center w-4/5 gap-5 mb-4"
				onSubmit={(event) => {
					event.preventDefault();
					const formData = new FormData(event.currentTarget);
					formData.set(
						"Name",
						`${formData.get("Folder") as string}${formData.get("Name") as string}`,
					);
					formData.delete("Folder");
					void filesFetcher.submit(formData, {
						action: "/files",
						method: "POST",
						encType: "multipart/form-data",
					});
				}}
			>
				<Input
					name="File"
					type="file"
					required
					errors={errors}
					onChange={(ev) => {
						if (
							ev.target.files &&
							ev.target.files[0].size > 29000000
						) {
							ev.target.value = "";
							setErrors({
								File: [
									"File too large, please select a file < 80mB",
								],
							});
							return;
						}
						if (name.length === 0) {
							setName(
								ev.target.value.substring(
									ev.target.value.lastIndexOf("\\") + 1,
								),
							);
							return;
						}
						setErrors({});
					}}
				/>
				<Input
					maxLength={100}
					name="Name"
					required
					value={name}
					pattern="^[^\/]*$"
					title="Must not contain a /"
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
					active
					pending={filesFetcher.state !== "idle"}
				>
					Upload
				</CheckButton>
			</filesFetcher.Form>
		</Modal>
	);
}
