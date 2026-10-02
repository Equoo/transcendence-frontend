import { type JSX, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { useLocation } from "react-router";

import { PermEnum } from "@/admin/api/roles";
import type { Channel, ChannelCategory } from "@/chat/api/chat.api";
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
					className="after:absolute after:inset-0"
					onClick={() => {
						setShow(!show);
					}}
				>
					<span>{category.name}</span>
				</div>
				{Boolean(user.role.permission & PermEnum.HandleChannels) && (
					<ChannelForm className="invisible" category={category.id}></ChannelForm>
				)}
				{/* <CategoryForm className="invisible" edit={category.id}></CategoryForm> */}
				{show ? (
					<FaAngleDown></FaAngleDown>
				) : (
					<FaAngleUp></FaAngleUp>
				)}
			</div>
			<ul>{childrens}</ul>
		</li>
	);
}

export default ItemChannelCategory;
