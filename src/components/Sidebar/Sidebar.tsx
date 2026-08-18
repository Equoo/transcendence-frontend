import { initDrawers } from "flowbite";
import { type JSX, Suspense, useEffect } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import {
	PiBookOpen,
	PiCalendarBlank,
	PiChat,
	PiHouse,
	PiPlus,
} from "react-icons/pi";
import { Await, Form, useLocation } from "react-router";
import { useShallow } from "zustand/react/shallow";

import { type Channel, fetchChannels } from "@/chat/api/chat.api";
import { useChat } from "@/chat/hooks/chat.hook";

import InvitationForm from "../../invitations/components/InvitationForm";
import ItemCategory from "./ItemCategory";
import ItemChannel from "./ItemChannel";

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

function Sidebar(): JSX.Element {
	const location = useLocation();
	const channels = useChat(
		useShallow((state) => Object.values(state.channels) as Channel[]),
	);

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
				<div className="h-full px-3 py-4 overflow-y-auto border-e border-border">
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
					<ul className="font-main font-medium text-text2">
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
						<li className="flex justify-between items-center px-2 py-1.5 mt-3 text-[11px] text-muted font-bold tracking-wider uppercase group">
							Channels{" "}
							<Form>
								<button
									className="cursor-pointer hover:text-text"
									type="submit"
									name="channelForm"
								>
									<PiPlus size={14} />
								</button>
							</Form>
						</li>
						<Suspense fallback={<ChannelListSkeleton />}>
							<Await resolve={fetchChannels()}>
								{channels.map((channel) => (
									<ItemChannel
										key={channel.id}
										channel={channel}
									></ItemChannel>
								))}
							</Await>
						</Suspense>
						<li className="flex justify-between items-center px-2 py-1.5 mt-3 text-[11px] text-muted font-bold tracking-wider uppercase group">
							Upcoming
						</li>
					</ul>

					{
						// NOTE: PLACEHOLDER
					}
					<select
						name="user"
						id="user"
						onChange={(ev) => {
							document.cookie = `UserName=${ev.target.value}`;
						}}
					>
						<option value="asventi">Asventi</option>
						<option value="equo">Equo</option>
					</select>
				</div>
			</aside>
		</>
	);
}

export default Sidebar;
