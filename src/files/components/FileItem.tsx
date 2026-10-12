import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { ListCell, ListRow } from "../../components/List/List";
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
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
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
					? t("files.sizeKb", {
							size: Math.floor(file.length / 1000),
						})
					: t("files.sizeMb", {
							size: Math.floor(file.length / 1000000),
						})}
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
