import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { PiGear, PiTrash } from "react-icons/pi";
import { NavLink, useLocation } from "react-router";

import { PermEnum } from "@/admin/api/roles";
import type { Channel } from "@/chat/api/chat.api";
import ChannelForm from "@/chat/components/ChannelForm";
import type { User } from "@/users/api/users";

import SidebarMenu, { useSidebarMenu } from "./SidebarMenu";

function ItemChannel({
	channel,
	category,
	user,
}: {
	channel: Channel;
	category?: string;
	user: User;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const location = useLocation();
	const active = new RegExp(`^/channels/${channel.id}/?$`, "u").test(
		location.pathname,
	);
	const canEdit = Boolean(user.role.permission & PermEnum.HandleChannels);
	const menu = useSidebarMenu(canEdit);

	// The menu renders in portals: kept outside the <li> so its events do not
	// bubble into the long press handlers
	return (
		<>
		<li
			{...menu.pressProps}
			className={[
				"relative flex items-center px-2 py-1 text-[14.5px] rounded-base group duration-120 curssor-pointer hover:[&_button]:visible",
				active
					? "bg-accent-soft text-text"
					: "hover:bg-hover hover:text-text",
				menu.pressClass,
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
			{canEdit && !menu.active && (
				<ChannelForm
					edit={channel}
					category={category}
					className={active ? "" : "invisible"}
				></ChannelForm>
			)}
		</li>
			<SidebarMenu
				menu={menu}
				rows={[
					{
						icon: PiGear,
						label: t("chat.editChannel"),
						action: { kind: "editChannel", channel, category },
					},
					{
						icon: PiTrash,
						label: t("chat.deleteChannel"),
						action: { kind: "deleteChannel", channel },
						danger: true,
					},
				]}
			/>
		</>
	);
}

export default ItemChannel;
