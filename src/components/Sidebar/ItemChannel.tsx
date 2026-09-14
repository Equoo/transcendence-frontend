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
						"flex items-center px-2 py-1.5 text-[14px] rounded-base group duration-120",
						isActive
							? "bg-accent-soft text-text"
							: "hover:bg-hover hover:text-text",
					].join(" ")
				}
			>
				{({ isActive }) => (
					<>
						<span
							className={`font-semibold ${isActive ? "text-accent" : "text-muted"}`}
						>
							#
						</span>
						<span className="ms-3">{channel.name}</span>
					</>
				)}
			</NavLink>
		</li>
	);
}

export default ItemChannel;
