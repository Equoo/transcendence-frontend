import { useEffect, useState, type JSX } from "react";
import { fetchFiles, type AppFile } from "../files/api/files.api";
import type { Route } from "./+types/knowledge";
import FileList from "../files/components/FileList";
import Promisable from "../events/components/Promisable";
import CheckButton from "../components/CheckButton";
import { PiUploadSimple } from "react-icons/pi";
import Modal from "../components/Modal";
import { Input } from "../components/Input";
import type { clientAction as filesAction } from "../files/routes/files.route";
import { useFetcher } from "react-router";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function clientLoader(): { files: Promise<AppFile[]> } {
	return { files: fetchFiles() };
}

export default function Knowledge({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	const [showUpload, setShowUpload] = useState(false);
	const filesFetcher = useFetcher<typeof filesAction>();

	useEffect(() => {
		if (filesFetcher.data) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowUpload(false);
		}
	}, [filesFetcher.data]);
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
					<filesFetcher.Form
						action="/files"
						method="POST"
						encType="multipart/form-data"
						className="flex flex-col items-center w-4/5 gap-5 mb-4"
					>
						<Input name="Name" required />
						<Input name="File" type="file" required />
						<CheckButton
							type="submit"
							active
							pending={filesFetcher.state !== "idle"}
						>
							Upload
						</CheckButton>
					</filesFetcher.Form>
				</Modal>
			)}
			<Promisable data={loaderData.files}>
				{(files) => <FileList files={files}></FileList>}
			</Promisable>
		</main>
	);
}
