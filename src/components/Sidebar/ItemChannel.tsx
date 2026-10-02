import type { JSX } from "react";
import { NavLink } from "react-router";

import type { Channel } from "@/chat/api/chat.api";

function ItemChannel({ channel }: { channel: Channel }): JSX.Element {
	return (
		<li>
			<NavLink
				to={`/channels/${channel.id}`}
				className={({ isActive }) =>
					[
						"flex items-center px-2 py-1.5 text-[14.5px] rounded-base group duration-120",
						isActive
							? "bg-accent-soft text-text"
							: "hover:bg-hover hover:text-text",
					].join(" ")
				}
			>
				{({ isActive }) => (
					<>
						<span
							className={`text-[18px] font-semibold ${isActive ? "text-accent" : "text-muted"}`}
						>
							#
						</span>
						<span className="ms-2">{channel.name}</span>
					</>
				)}
			</NavLink>
		</li>
	);
}

export default ItemChannel;
