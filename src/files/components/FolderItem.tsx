import type { JSX } from "react";
import { FcFolder } from "react-icons/fc";
import { PiDotsThreeVerticalBold } from "react-icons/pi";

export default function FolderItem({
	name,
	onClick,
}: {
	name: string;
	onClick: (name: string) => void;
}): JSX.Element {
	return (
		<tr className="bg-surface border-b border-border">
			<th
				scope="row"
				className="flex items-center gap-2 pl-2.5 pr-6 py-4 font-medium text-text whitespace-nowrap"
				onClick={() => {
					onClick(name);
				}}
			>
				<FcFolder />
				<p className="hover:underline hover:cursor-pointer">{name}</p>
			</th>
			<td className="px-6 py-4">Folder</td>
			<td className="px-6 py-4">-</td>
			<td className="py-4">-</td>
			<td className="py-4">
				<PiDotsThreeVerticalBold size={18} />
			</td>
		</tr>
	);
}
