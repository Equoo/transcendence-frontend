import type { JSX } from "react";
import type { AppFile } from "../api/files.api";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { Link } from "react-router";

export default function FileItem({ file }: { file: AppFile }): JSX.Element {
	return (
		<tr className="bg-surface border-b border-border">
			<th
				scope="row"
				className="pl-8 pr-6 py-4 font-medium text-text whitespace-nowrap"
			>
				<Link to={`/knowledge/${file.key}`}>{file.name}</Link>
			</th>
			<td className="px-6 py-4">{file.contentType}</td>
			<td className="px-6 py-4">{file.length}</td>
			<td className="py-4">{file.creator.userName}</td>
			<td className="py-4">
				<Link to={`/knowledge/${file.key}`}>
					<PiDotsThreeVerticalBold size={18} />
				</Link>
			</td>
		</tr>
	);
}
