import { type JSX, useState } from "react";
import { PiUploadSimple } from "react-icons/pi";

import CheckButton from "../components/CheckButton";
import Promisable from "../components/Promisable";
import { type AppFile, fetchFiles } from "../files/api/files.api";
import FileList from "../files/components/FileList";
import FileUpload from "../files/components/FileUpload";
import type { Route } from "./+types/knowledge";

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
				<FileUpload
					onClose={() => {
						setShowUpload(false);
					}}
				/>
			)}
			<Promisable data={loaderData.files}>
				{(files) => <FileList files={files}></FileList>}
			</Promisable>
		</main>
	);
}
