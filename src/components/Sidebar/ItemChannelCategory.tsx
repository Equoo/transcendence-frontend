import { type JSX, type ReactNode, useState } from "react";

import type { ChannelCategory } from "@/chat/api/chat.api";
import ChannelForm from "@/chat/components/ChannelForm";

function ItemChannelCategory({ children, category }: { children: ReactNode, category: ChannelCategory }): JSX.Element {
	const [show, setShow] = useState(true);

	return (
		<li className="mb-3">
			<div className="flex justify-between items-center px-2 text-[13px] rounded-base group duration-120 cursor-pointer hover:text-text"
				onClick={() => { setShow(!show); }}
			>
				<span>{category.name}</span>
				<ChannelForm></ChannelForm>
			</div>
			<ul>
				{show && children}
			</ul>
		</li>
	);
}

export default ItemChannelCategory;
