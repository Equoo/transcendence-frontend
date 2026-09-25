import type { JSX } from "react";
import { NavLink, useLocation } from "react-router";

import { PermEnum } from "@/admin/api/roles";
import type { Channel } from "@/chat/api/chat.api";
import ChannelForm from "@/chat/components/ChannelForm";
import type { User } from "@/users/api/users.api";

function ItemChannel({ channel, category, user }: { channel: Channel, category?: string, user: User }): JSX.Element {
	const location = useLocation();
	const active = new RegExp(`^/channels/${channel.id}/?$`, "u").test(
		location.pathname,
	);

	return (
		<li
			className={[
				"relative flex items-center px-2 py-1 text-[14.5px] rounded-base group duration-120 curssor-pointer hover:[&_button]:visible",
				active
					? "bg-accent-soft text-text"
					: "hover:bg-hover hover:text-text",
			].join(" ")}
		>
			<NavLink
				to={`/channels/${channel.id}`}
				className="after:absolute after:inset-0"
			>
				{({ isActive }) => (
					<>
						<span
							className={`text-[16px] font-semibold ${isActive ? "text-accent" : "text-muted"}`}
						>
							#
						</span>
						<span className="ms-2">{channel.name}</span>
					</>
				)}
			</NavLink>
			{Boolean(user.role.permission & PermEnum.HandleChannels) && (
				<ChannelForm edit={channel} category={category} className={active ? "" : "invisible"}></ChannelForm>
			)}
		</li>
	);
}

export default ItemChannel;
