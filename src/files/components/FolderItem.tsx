import type { JSX } from "react";
import { FcFolder } from "react-icons/fc";

import { ListAction, ListCell, ListRow } from "../../components/List";
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
					className="gap-2 whitespace-nowrap"
				>
					<FcFolder aria-hidden="true" />
					{name}
				</ListAction>
			</ListCell>
			<ListCell>Folder</ListCell>
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
