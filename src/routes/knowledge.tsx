import { useState, type JSX } from "react";
import { fetchFiles, type AppFile } from "../files/api/files.api";
import type { Route } from "./+types/knowledge";
import FileList from "../files/components/FileList";
import Promisable from "../events/components/Promisable";
import CheckButton from "../components/CheckButton";
import { PiUploadSimple } from "react-icons/pi";
import Modal from "../components/Modal";
import { Input } from "../components/Input";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function clientLoader(): { files: Promise<AppFile[]> } {
	return { files: fetchFiles() };
}

export default function Knowledge({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	const [showUpload, setShowUpload] = useState(false);

	return (
		<main className="w-7/10 justify-center flex flex-col gap-1">
			<CheckButton
				active
				activeCheck={false}
				className="self-end mt-20"
				onClick={() => {
					setShowUpload(true);
				}}
			>
				<PiUploadSimple />
				Upload
			</CheckButton>
			{showUpload && (
				<Modal
					title="Upload a file"
					onClose={() => {
						setShowUpload(false);
					}}
				>
					<Input name="Name" required />
					<Input name="File" type="file" required />
					<CheckButton active>Upload</CheckButton>
				</Modal>
			)}
			<Promisable data={loaderData.files}>
				{(files) => <FileList files={files}></FileList>}
			</Promisable>
		</main>
	);
}
