import type { JSX } from "react";

import Promisable from "../components/Promisable";
import { type AppFile, fetchFiles } from "../files/api/files.api";
import FileList from "../files/components/FileList";
import type { Route } from "./+types/knowledge";

export function clientLoader(): { files: Promise<AppFile[]> } {
	return { files: fetchFiles() };
}

export default function Knowledge({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	return (
		<main className="w-7/10 h-full flex flex-col gap-1">
			<Promisable data={loaderData.files}>
				{(files) => <FileList files={files}></FileList>}
			</Promisable>
		</main>
	);
}
