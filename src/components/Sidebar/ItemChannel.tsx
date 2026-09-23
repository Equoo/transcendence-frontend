import { type JSX, useState } from "react";
import { NavLink } from "react-router";

import type { Channel } from "@/chat/api/chat.api";
import ChannelForm from "@/chat/components/ChannelForm";

function ItemChannel({ channel }: { channel: Channel }): JSX.Element {
	const [active, setActive] = useState(false);

	return (
		<li
			className={[
				"relative flex items-center px-2 py-1.5 text-[14.5px] rounded-base group duration-120 curssor-pointer",
				active
					? "bg-accent-soft text-text"
					: "hover:bg-hover hover:text-text",
			].join(" ")}
		>
			<NavLink
				to={`/channels/${channel.id}`}
				className="after:absolute after:inset-0"
			>
				{({ isActive }) => {
					setActive(isActive);
					return (
						<>
							<span
								className={`text-[18px] font-semibold ${isActive ? "text-accent" : "text-muted"}`}
							>
								#
							</span>
							<span className="ms-2">{channel.name}</span>
						</>
					);
				}}
			</NavLink>
			<ChannelForm edit={channel}></ChannelForm>
		</li>
	);
}

export default ItemChannel;
