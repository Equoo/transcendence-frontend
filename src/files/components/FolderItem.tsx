import type { JSX } from "react";

import { ListAction, ListCell, ListRow } from "../../components/List/List";
import { FolderIcon } from "./FileIcon";
import ItemActions from "./ItemActions";

export default function FolderItem({
	name,
	onClick,
	parent,
	folders,
}: {
	name: string;
	onClick: (name: string) => void;
	parent?: string;
	folders?: string[];
}): JSX.Element {
	return (
		<ListRow>
			<ListCell rowHeader>
				<ListAction
					onClick={() => {
						onClick(name);
					}}
					className="gap-3 whitespace-nowrap"
				>
					<FolderIcon />
					{name}
				</ListAction>
			</ListCell>
			<ListCell>-</ListCell>
			<ListCell>
				{typeof parent === "string" && folders && (
					<ItemActions
						parent={parent}
						name={name}
						folders={folders}
					/>
				)}
			</ListCell>
		</ListRow>
	);
}
