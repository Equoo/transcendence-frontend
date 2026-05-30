import type { JSX, ReactNode } from "react";
import type { IconType } from "react-icons";

function ItemCategorie({
	children,
	icon: Icon,
}: {
	children: ReactNode;
	icon: IconType;
}): JSX.Element {
	return (
		<li>
			<a
				href="#"
				className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-hover hover:text-text
                group duration-120"
			>
				<Icon size={18} />
				<span className="ms-3">{children}</span>
			</a>
		</li>
	);
}

export default ItemCategorie;
