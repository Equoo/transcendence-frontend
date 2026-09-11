import { ListRow, ListCell, ListActions } from "../../components/List";
import type { JSX } from "react";
import type { AppFile } from "../api/files.api";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { Link } from "react-router";

export default function FileItem({ file }: { file: AppFile }): JSX.Element {
	return (
		<ListRow>
			<ListCell rowHeader>
				<Link
					className="hover:underline focus-visible:outline-accent"
					to={`/knowledge/${file.key}`}
				>
					{file.name}
				</Link>
			</ListCell>
			<ListCell>{file.contentType}</ListCell>
			<ListCell>{file.length}</ListCell>
			<ListCell>
				<ListActions>
					<Link
						className="inline-flex rounded-sm p-1 text-text2 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
						aria-label={`View ${file.name}`}
						to={`/knowledge/${file.key}`}
					>
						<PiDotsThreeVerticalBold size={18} />
					</Link>
				</ListActions>
			</ListCell>
		</ListRow>
	);
}
