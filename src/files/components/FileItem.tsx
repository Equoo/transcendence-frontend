import type { JSX } from "react";
import { Link } from "react-router";

import { ListCell, ListRow } from "../../components/List";
import type { AppFile } from "../api/files.api";
import ItemActions from "./ItemActions";

export default function FileItem({
	file,
	parent,
	folders,
}: {
	file: AppFile;
	parent: string;
	folders: string[];
}): JSX.Element {
	const name = file.name.slice(parent.length);

	return (
		<ListRow>
			<ListCell rowHeader>
				<Link
					className="hover:underline focus-visible:outline-accent"
					to={`/knowledge/${file.key}`}
				>
					{name}
				</Link>
			</ListCell>
			<ListCell>{file.contentType}</ListCell>
			<ListCell>
				{file.length / 1000000 < 1
					? `${Math.floor(file.length / 1000)} Ko`
					: `${Math.floor(file.length / 1000000)} Mo`}
			</ListCell>
			<ListCell>
				<ItemActions
					fileKey={file.key}
					parent={parent}
					name={name}
					folders={folders}
				/>
			</ListCell>
		</ListRow>
	);
}
