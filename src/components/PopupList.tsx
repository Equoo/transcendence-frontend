import { type ReactNode, useRef } from "react";
import type { JSX } from "react/jsx-runtime";

import { useClickOutside } from "@/hooks/useClickOutside";

interface Row {
	id: string;
	onClick?: () => void;
	content: ReactNode;
}

export default function PopupList({
	onClose,
	rows,
	className,
}: {
	onClose: () => void;
	rows: Row[];
	className?: string;
}): JSX.Element {
	const clickOutsideRef = useClickOutside<HTMLUListElement>(
		useRef(null),
		onClose,
	);

	return (
		<ul
			ref={clickOutsideRef}
			className={`absolute p-2 bg-back rounded-md flex flex-col ${className}`}
		>
			{rows.map((row) => (
				<li
					key={row.id}
					onClick={row.onClick}
					className="text-text font-medium p-2 hover:bg-back2 rounded-md cursor-pointer"
				>
					{row.content}
				</li>
			))}
		</ul>
	);
}
