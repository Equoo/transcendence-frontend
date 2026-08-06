import { useEffect, useState, type JSX } from "react";
import Modal from "../../components/Modal";
import type { clientAction as filesAction } from "../routes/files.route";
import { useFetcher } from "react-router";
import { Input } from "../../components/Input";
import CheckButton from "../../components/CheckButton";

export default function FileUpload({
	onClose,
}: {
	onClose: () => void;
}): JSX.Element {
	const [name, setName] = useState("");
	const filesFetcher = useFetcher<typeof filesAction>();

	useEffect(() => {
		if (filesFetcher.data) {
			onClose();
		}
	}, [filesFetcher.data]);
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
