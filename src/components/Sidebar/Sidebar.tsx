import { initDrawers } from "flowbite";
import { type JSX, Suspense, useEffect, useState } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import {
	PiBookOpen,
	PiCalendarBlank,
	PiChat,
	PiGear,
	PiHouse,
} from "react-icons/pi";
import { Await, Link, useFetcher, useLocation } from "react-router";
import { useShallow } from "zustand/react/shallow";

import AdminSidebar from "@/admin/components/AdminSidebar";
import type { Channel } from "@/chat/api/chat.api";
import CategoryForm from "@/chat/components/CategoryForm";
import { useChat } from "@/chat/hooks/chat.hook";
import { isWhitelisted } from "@/chat/utils/channel.util";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Profile from "@/users/components/Profile";

import { PermEnum } from "../../admin/api/roles";
import InvitationForm from "../../invitations/components/InvitationForm";
import type { User } from "../../users/api/users";
import ProfileLine from "../Profile/ProfileLine";
import ItemCategory from "./ItemCategory";
import ItemChannel from "./ItemChannel";
import ItemChannelCategory from "./ItemChannelCategory";

function ChannelListSkeleton(): JSX.Element {
	return (
		<>
			{Array.from({ length: 4 }, (___, index) => (
				<li key={index}>
					<div className="flex items-center px-2 py-1.5 text-[14px] rounded-base group duration-120 shadow-main animate-pulse">
						<span className="font-semibold text-muted">#</span>
						<div className="ms-3 py-1 h-3 w-32 rounded bg-muted"></div>
					</div>
				</li>
			))}
		</>
	);
}

function Sidebar({
	user,
	channels: channelsInit,
}: {
	user: User;
	channels: Channel[] | Promise<Channel[]>;
}): JSX.Element {
	const location = useLocation();
	const fetcher = useFetcher();
	const dictCategories = useChat(useShallow((state) => state.categories));
	const channels = useChat(
		useShallow((state) => Object.values(state.channels)),
	).filter(
		(ch) =>
			!ch.eventId &&
			isWhitelisted(
				ch,
				user,
				ch.categorySync && ch.categoryId !== null
					? dictCategories[ch.categoryId ?? ""]
					: null,
			),
	);
	const categories = useChat(
		useShallow((state) => Object.values(state.categories)),
	);

	const [showUser, setShowUser] = useState(false);

	useEffect(() => {
		initDrawers();
	}, []);

	const isMobile = useMediaQuery("(max-width: 639px)");
	useEffect(() => {
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
	}, [isMobile, location.pathname]);

	return (
		<>
			<button
				data-drawer-target="sidebar"
				data-drawer-toggle="sidebar"
				aria-controls="sidebar"
				type="button"
				className="fixed z-39 text-heading bg-transparent box-border border border-border hover:bg-back2
				focus:ring-4 focus:ring-border2 font-medium leading-5 rounded-xl top-0 left-0 text-sm p-1
				focus:outline-none inline-flex sm:hidden"
			>
				<span className="sr-only">Open sidebar</span>
				<HiMenuAlt2 size={25} />
			</button>

			<aside
				id="sidebar"
				className="fixed top-0 left-0 z-40 w-64 h-full max-h-full  transition-transform -translate-x-full sm:translate-x-0
				bg-back2"
				aria-label="Sidebar"
			>
				<div className="h-full flex flex-col px-3 py-4 border-e border-border space-y-3 font-main font-medium text-muted text-[14.5px]">
					<Link to="/" className="flex items-center ps-1 mb-5">
						<img src="/logo/icon-tile.svg" className="h-10 me-3" />
						<div className="flex flex-col self-center">
							<span className="text-text font-head font-semibold text-[17px]">
								Keep Grouped
							</span>
							<span className="text-muted font-main font-normal text-sm">
								Transcendance Project
							</span>
						</div>
					</Link>
					{Boolean(user.role.permission & PermEnum.InviteUser) && (
						<InvitationForm className=""></InvitationForm>
					)}
					<ul className="mt-4">
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
							Private Messages
						</ItemCategory>
					</ul>

					<div className="flex-1 overflow-y-auto">
						<ul>
							<li className="flex justify-between items-center px-2 py-1.5 mt-3 text-[11px] text-muted font-bold tracking-wider uppercase group">
								Upcoming
								<span className="ml-auto">0</span>
							</li>
						</ul>

						<div className="relative flex justify-between items-center px-2 py-1.5 mt-3 text-[11px] text-muted font-bold tracking-wider uppercase group">
							Channels{" "}
							{Boolean(
								user.role.permission & PermEnum.HandleChannels,
							) && <CategoryForm></CategoryForm>}
						</div>
						<ul>
							<Suspense fallback={<ChannelListSkeleton />}>
								<Await resolve={channelsInit}>
									{channels
										.filter(
											(ch) =>
												ch.categoryId === null ||
												!Object.hasOwn(
													dictCategories,
													ch.categoryId ?? "",
												),
										)
										.map((channel) => (
											<ItemChannel
												key={channel.id}
												channel={channel}
												user={user}
											></ItemChannel>
										))}
									<li className="mb-3"></li>
									{categories.map((category) => (
										<ItemChannelCategory
											key={category.id}
											category={category}
											channels={channels.filter(
												(ch) =>
													ch.categoryId ===
													category.id,
											)}
											user={user}
										></ItemChannelCategory>
									))}
								</Await>
							</Suspense>
						</ul>
					</div>
					<AdminSidebar user={user} />
					{
						showUser && (
							<Profile
								role={user.role}
								fetcher={fetcher}
								user={user}
								onClose={() => {
									setShowUser(false);
								}}
							/>
						)
					}
					<div className="flex items-center gap-8  w-full h-20">
						<ProfileLine user={user} status edit size={3} />
						<PiGear
							className="absolute text-muted right-5 hover:text-text2 cursor-pointer"
							size={20}
							onClick={() => {
								setShowUser(true);
							}}
						></PiGear>
					</div>
				</div >
			</aside >
		</>
	);
}

export default Sidebar;
