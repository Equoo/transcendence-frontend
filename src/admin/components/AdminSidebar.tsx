import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { PiComputerTower, PiUser } from "react-icons/pi";

import ItemCategory from "@/components/Sidebar/ItemCategory";
import type { User } from "@/users/api/users";

import { PermEnum } from "../api/roles";

export default function AdminSidebar({ user }: { user: User }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	return (
		<div className="font-main font-medium text-muted text-[14.5px]">
			{(Boolean(user.role.permission & PermEnum.HandleUsers) ||
				Boolean(user.role.permission & PermEnum.HandleRoles)) && (
				<ul className="flex flex-col justify-center border-border2 border-t-2 border-b-2">
					{Boolean(user.role.permission & PermEnum.HandleUsers) && (
						<ItemCategory to="/admin/users" icon={PiUser}>
							{t("admin.users")}
						</ItemCategory>
					)}
					{Boolean(user.role.permission & PermEnum.HandleRoles) && (
						<ItemCategory to="/admin/roles" icon={PiComputerTower}>
							{t("admin.roles")}
						</ItemCategory>
					)}
				</ul>
			)}
		</div>
	);
}
