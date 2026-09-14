import { type JSX, useEffect, useState } from "react";
import { useFetcher } from "react-router";

import { APIError, type ValidationErrors } from "../../api/problem_detail";
import CheckButton from "../../components/CheckButton";
import { Input } from "../../components/Input";
import Modal from "../../components/Modal";
import type { clientAction as filesAction } from "../routes/files.route";

export default function FileUpload({
	onClose,
}: {
	onClose: () => void;
}): JSX.Element {
	const [errors, setErrors] = useState<ValidationErrors>();
	const [name, setName] = useState("");
	const filesFetcher = useFetcher<typeof filesAction>();

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
			>
				<Input
					name="File"
					type="file"
					required
					errors={errors}
					onChange={(ev) => {
						setName(
							ev.target.value.substring(
								ev.target.value.lastIndexOf("\\") + 1,
							),
						);
					}}
				/>
				<Input
					name="Name"
					required
					value={name}
					errors={errors}
					onChange={(ev) => {
						setName(ev.target.value);
					}}
				/>
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
