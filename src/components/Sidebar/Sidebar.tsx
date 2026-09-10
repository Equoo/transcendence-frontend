/* eslint-disable no-bitwise */
import { type JSX, useEffect } from "react";
import {
	PiBookOpen,
	PiCalendarBlank,
	PiChat,
	PiComputerTower,
	PiHouse,
	PiUser,
} from "react-icons/pi";
import { HiMenuAlt2 } from "react-icons/hi";
import ItemCategory from "./ItemCategorie";
import { initDrawers } from "flowbite";
import { useLocation } from "react-router";
import InvitationForm from "../../invitations/components/InvitationForm";
import type { User } from "../../users/api/users.api";
import ProfileLine from "../ProfileLine";

function Sidebar({ user }: { user: User }): JSX.Element {
	const location = useLocation();

	useEffect(() => {
		initDrawers();
	}, []);

	useEffect(() => {
		const isMobile = window.matchMedia("(max-width: 639px)").matches;
		if (!isMobile) {
			return;
		}
		const sidebar = document.getElementById("sidebar");

		const toggleButton = document.querySelector<HTMLButtonElement>(
			'button[data-drawer-target="sidebar"]',
		);
		if (sidebar?.classList.contains("transform-none") ?? false) {
			toggleButton?.click();
		}
	}, [location.pathname]);

	return (
		<>
			<button
				data-drawer-target="sidebar"
				data-drawer-toggle="sidebar"
				aria-controls="sidebar"
				type="button"
				className="fixed z-39 text-heading bg-transparent box-border border border-transparent hover:bg-back2
				focus:ring-4 focus:ring-border2 font-medium leading-5 rounded-xl top-0 left-0 text-sm p-1
				focus:outline-none inline-flex sm:hidden"
			>
				<span className="sr-only">Open sidebar</span>
				<HiMenuAlt2 size={25} />
			</button>

			<aside
				id="sidebar"
				className="fixed top-0 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0
				bg-back2"
				aria-label="Sidebar"
			>
				<div className="h-full flex flex-col px-3 py-4 border-e border-border">
					<a href="#" className="flex items-center ps-1 mb-5">
						<img
							src="/logo/icon-tile.svg"
							className="h-10 me-3"
							alt="Flowbite Logo"
						/>
						<div className="flex flex-col self-center">
							<span className="text-text font-head font-semibold text-[17px]">
								Keep Grouped
							</span>
							<span className="text-muted font-main font-normal text-sm">
								Transcendance Team
							</span>
						</div>
					</a>
					<InvitationForm className=""></InvitationForm>
					<ul className="mt-4 space-y-3 font-medium text-muted text-[14.5px]">
						<ItemCategory to="/" icon={PiHouse}>
							Home
						</ItemCategory>
						<ItemCategory to="/calendar" icon={PiCalendarBlank}>
							Calendar
						</ItemCategory>
						<ItemCategory to="/knowledge" icon={PiBookOpen}>
							Knowledge
						</ItemCategory>
						<ItemCategory to="/messages" icon={PiChat}>
							Messages
						</ItemCategory>
					</ul>
					<ul className="border-b-2 border-t-2 border-border2 mt-auto">
						{user.role.permission & 1 && (
							<div className="mt-1 font-medium text-muted text-[14.5px]">
								<ItemCategory to="/admin/users" icon={PiUser}>
									Users
								</ItemCategory>
								<ItemCategory
									to="/admin/roles"
									icon={PiComputerTower}
								>
									Roles
								</ItemCategory>
							</div>
						)}
					</ul>
					<ProfileLine user={user} />
				</div>
			</aside>
		</>
	);
}

export default Sidebar;
