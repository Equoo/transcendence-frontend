/* eslint-disable no-bitwise */
import type { JSX } from "react";
import { PiComputerTower, PiUser } from "react-icons/pi";

import ItemCategory from "@/components/Sidebar/ItemCategory";
import type { User } from "@/users/api/users.api";

import { PermEnum } from "../api/roles";

export default function AdminSidebar({user}: {user: User}): JSX.Element {
	return (
		<div className="border-t-2 border-border2 mt-auto font-main font-medium text-muted text-[14.5px]">
			{Boolean(user.role.permission & PermEnum.HandleUsers) &&
				(Boolean(user.role.permission & PermEnum.HandleUsers) ||
					Boolean(user.role.permission & PermEnum.HandleRoles)) && (
					<ul className=" pb-1 border-border2">
						{Boolean(
							user.role.permission & PermEnum.HandleUsers,
						) && (
							<ItemCategory to="/admin/users" icon={PiUser}>
								Users
							</ItemCategory>
						)}
						{Boolean(
							user.role.permission & PermEnum.HandleRoles,
						) && (
							<ItemCategory
								to="/admin/roles"
								icon={PiComputerTower}
							>
								Roles
							</ItemCategory>
						)}
						<div className="border-border2 border"></div>
					</ul>
				)}
		</div>
	);
}
