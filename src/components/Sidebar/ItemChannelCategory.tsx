import { type JSX, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { useLocation } from "react-router";

import { PermEnum } from "@/admin/api/roles";
import type { Channel, ChannelCategory } from "@/chat/api/chat.api";
import CategoryForm from "@/chat/components/CategoryForm";
import ChannelForm from "@/chat/components/ChannelForm";
import type { User } from "@/users/api/users.api";

import ItemChannel from "./ItemChannel";

function ItemChannelCategory({
	category,
	channels,
	user,
}: {
	category: ChannelCategory;
	channels: Channel[];
	user: User;
}): JSX.Element {
	const [show, setShow] = useState(true);
	const location = useLocation();

	const childrens = channels.map((channel) =>
		((new RegExp(`^/channels/${channel.id}/?$`, "u").test(location.pathname)) || show) &&
		(<ItemChannel
			key={channel.id}
			channel={channel}
			category={category.id}
			user={user}
		></ItemChannel>)
	);

	return (
		<li className="mb-3">
			<div className="relative flex justify-between items-center px-2 py-1 text-[13px] rounded-base group duration-120 cursor-pointer hover:text-text hover:[&_button]:visible">
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

				{Boolean(user.role.permission & PermEnum.HandleChannels) && (<div className="ml-auto mr-1">
					<CategoryForm edit={category} className="invisible"></CategoryForm>
					<ChannelForm className="invisible" category={category.id}></ChannelForm>
				</div>)}
			</div>
			<ul>{childrens}</ul>
		</li>
	);
}

export default ItemChannelCategory;
