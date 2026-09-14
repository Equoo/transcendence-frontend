import type { JSX } from "react";
import { FcFolder } from "react-icons/fc";
import { PiDotsThreeVerticalBold } from "react-icons/pi";

import {
	ListAction,
	ListActions,
	ListCell,
	ListRow,
} from "../../components/List";

export default function FolderItem({
	name,
	onClick,
}: {
	name: string;
	onClick: (name: string) => void;
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
			<ListCell>-</ListCell>
			<ListCell>
				<ListActions>
					<ListAction
						aria-label={`Open folder ${name}`}
						onClick={() => {
							onClick(name);
						}}
					>
						<PiDotsThreeVerticalBold size={18} />
					</ListAction>
				</ListActions>
			</ListCell>
		</ListRow>
	);
}
