import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { PiGear, PiPlus, PiTrash } from "react-icons/pi";
import { useLocation } from "react-router";

import { PermEnum } from "@/admin/api/roles";
import type { Channel, ChannelCategory } from "@/chat/api/chat.api";
import CategoryForm from "@/chat/components/CategoryForm";
import ChannelForm from "@/chat/components/ChannelForm";
import { isWhitelisted } from "@/chat/utils/channel.util";
import type { User } from "@/users/api/users";

import ItemChannel from "./ItemChannel";
import SidebarMenu, { useSidebarMenu } from "./SidebarMenu";

function ItemChannelCategory({
	category,
	channels,
	user,
}: {
	category: ChannelCategory;
	channels: Channel[];
	user: User;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [show, setShow] = useState(true);
	const location = useLocation();
	const canEdit = Boolean(user.role.permission & PermEnum.HandleChannels);
	const menu = useSidebarMenu(canEdit);

	const childrens = channels.map(
		(channel) =>
			(new RegExp(`^/channels/${channel.id}/?$`, "u").test(
				location.pathname,
			) ||
				show) && (
				<ItemChannel
					key={channel.id}
					channel={channel}
					category={category.id}
					user={user}
				></ItemChannel>
			),
	);

	if (childrens.length === 0 && !isWhitelisted(category, user)) {
		return <li></li>;
	}

	return (
		<li className="mb-3">
			<div
				{...menu.pressProps}
				className={`relative flex justify-between items-center px-2 py-1 text-[13px] rounded-base group duration-120 cursor-pointer hover:text-text hover:[&_button]:visible ${menu.pressClass}`}
			>
				<div
					className="flex flex-row gap-2 items-center after:absolute after:inset-0"
					onClick={() => {
						setShow(!show);
					}}
				>
					<span>{category.name}</span>
					{show ? (
						<FaAngleDown size={13}></FaAngleDown>
					) : (
						<FaAngleUp size={13}></FaAngleUp>
					)}
				</div>

				{canEdit && !menu.active && (
					<div className="ml-auto mr-1">
						<CategoryForm
							edit={category}
							className="invisible"
						></CategoryForm>
						<ChannelForm
							className="invisible"
							category={category.id}
						></ChannelForm>
					</div>
				)}
			</div>
			<SidebarMenu
				menu={menu}
				rows={[
					{
						icon: PiPlus,
						label: t("chat.createChannelTitle"),
						action: { kind: "createChannel", category: category.id },
					},
					{
						icon: PiGear,
						label: t("chat.editCategory"),
						action: { kind: "editCategory", category },
					},
					{
						icon: PiTrash,
						label: t("chat.deleteCategory"),
						action: { kind: "deleteCategory", category },
						danger: true,
					},
				]}
			/>
			<ul>{childrens}</ul>
		</li>
	);
}

export default ItemChannelCategory;
