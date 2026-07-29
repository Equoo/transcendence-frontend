import type { JSX } from "react";
import type { APIFile } from "../api/files.api";

export default function APIFileList({
	files,
}: {
	files: APIFile[];
}): JSX.Element {
	return (
		<div>
			{files.map((file) => (
				<div key={file.key}>{file.name}</div>
			))}
		</div>
	);
}
