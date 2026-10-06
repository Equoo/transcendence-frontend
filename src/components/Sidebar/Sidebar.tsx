/* eslint-disable no-bitwise */
import { type JSX, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import {
	PiBookOpen,
	PiCalendarBlank,
	PiChat,
	PiGear,
	PiHouse,
} from "react-icons/pi";
import { Await, Link, useFetcher } from "react-router";
import { useShallow } from "zustand/react/shallow";

import AdminSidebar from "@/admin/components/AdminSidebar";
import type { Channel } from "@/chat/api/chat.api";
import ChannelForm from "@/chat/components/ChannelForm";
import { useChat } from "@/chat/hooks/chat.hook";
import { useClickOutside } from "@/hooks/useClickOutside";
import Profile from "@/users/components/Profile";

import { PermEnum } from "../../admin/api/roles";
import InvitationForm from "../../invitations/components/InvitationForm";
import type { User } from "../../users/api/users";
import ProfileLine from "../Profile/ProfileLine";
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

function Sidebar({
	user,
	channels: channelsInit,
}: {
	user: User;
	channels: Channel[] | Promise<Channel[]>;
}): JSX.Element {
	const fetcher = useFetcher();
	const channels = useChat(
		useShallow((state) => Object.values(state.channels) as Channel[]),
	);

	const [showSide, setShowSide] = useState(false);
	const [showUser, setShowUser] = useState(false);

	const barClickOutsideRef = useClickOutside(
		useRef<HTMLDivElement>(null),
		() => {
			if (!showUser) {
				setShowSide(false);
			}
		},
	);

	const profileClickOutside = useCallback(() => {
		setShowUser(false);
	}, [setShowUser]);

	useEffect(() => {
		const isMobile = window.matchMedia("(max-width: 64rem)").matches;
		if (!isMobile) {
			return;
		}
		// eslint-disable-next-line @eslint-react/set-state-in-effect
		setShowSide(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname]);

	return (
		<>
			<button
				type="button"
				className="fixed z-39 text-heading bg-transparent box-border border border-transparent hover:bg-back2
				focus:ring-4 focus:ring-border2 font-medium leading-5 rounded-xl top-4 left-6 text-sm p-1
				focus:outline-none inline-flex lg:hidden"
				onClick={() => {
					setShowSide(!showSide);
				}}
			>
				<span className="sr-only">Open sidebar</span>
				<HiMenuAlt2 size={25} />
			</button>

			<aside
				className={`fixed top-0 left-0 z-40 w-64 h-full transition-transform bg-back2
						${showSide ? "translate-x-0" : "-translate-x-full"}
          				 lg:translate-x-0`}
				ref={barClickOutsideRef}
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
							Messages
						</ItemCategory>
						<ChannelForm></ChannelForm>
						<Suspense fallback={<ChannelListSkeleton />}>
							<Await resolve={channelsInit}>
								{channels.map(
									(channel) =>
										!channel.eventId && (
											<ItemChannel
												key={channel.id}
												channel={channel}
											></ItemChannel>
										),
								)}
							</Await>
						</Suspense>
						<li className="flex justify-between items-center px-2 py-1.5 mt-3 text-[11px] text-muted font-bold tracking-wider uppercase group">
							Upcoming
						</li>
					</ul>
					<AdminSidebar user={user} />
					{showUser && (
						<Profile
							role={user.role}
							fetcher={fetcher}
							user={user}
							onClose={() => {
								setShowUser(false);
							}}
							onClickOutside={profileClickOutside}
						/>
					)}
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
				</div>
			</aside>
		</>
	);
}

export default Sidebar;
