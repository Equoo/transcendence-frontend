import type { JSX, ReactNode } from "react";

import type { ChannelCategory } from "@/chat/api/chat.api";

function ItemChannelCategory({ children, category }: { children: ReactNode, category: ChannelCategory }): JSX.Element {
	return (
		<li>
			<span className="ms-3">{category.name}</span>
			<ul>
				{/* {({ isActive }) => ( */}
				{children}
				{/* )} */}
			</ul>
		</li>
	);
}

export default ItemChannelCategory;
