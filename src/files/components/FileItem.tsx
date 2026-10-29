/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { PermEnum } from "@/admin/api/roles";
import { useUser } from "@/users/hooks/users";

import { ListCell, ListRow } from "../../components/List/List";
import type { AppFile } from "../api/files.api";
import { FileIcon } from "./FileIcon";
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
	const user = useUser();

	return (
		<ListRow>
			<ListCell rowHeader>
				<Link
					className="inline-flex items-center gap-3 rounded-sm p-1 hover:underline focus-visible:outline-accent"
					to={`/knowledge/${file.key}`}
				>
					<FileIcon contentType={file.contentType} />
					{name}
				</Link>
			</ListCell>
			<ListCell>
				{file.length / 1000000 < 1
					? t("files.sizeKb", {
							size: Math.floor(file.length / 1000),
						})
					: t("files.sizeMb", {
							size: Math.floor(file.length / 1000000),
						})}
			</ListCell>
			{Boolean(user!.role.permission & PermEnum.HandleKnowledge) && (
				<ListCell>
					<ItemActions
						fileKey={file.key}
						parent={parent}
						name={name}
						folders={folders}
					/>
				</ListCell>
			)}
		</ListRow>
	);
}
