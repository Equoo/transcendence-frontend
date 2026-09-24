/* eslint-disable capitalized-comments */
/* eslint-disable max-lines */
/* eslint-disable no-bitwise */
import { initDrawers } from "flowbite";
import { type JSX, Suspense, useEffect, useRef, useState } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import {
	PiBookOpen,
	PiCalendarBlank,
	PiChat,
	PiComputerTower,
	PiGear,
	PiHouse,
	PiUser,
} from "react-icons/pi";
import { Await, Link, useFetcher, useLocation } from "react-router";
import { useShallow } from "zustand/react/shallow";

import type { Channel } from "@/chat/api/chat.api";
import ChannelForm from "@/chat/components/ChannelForm";
import { useChat } from "@/chat/hooks/chat.hook";
import { useClickOutside } from "@/hooks/useClickOutside";

import { PermEnum } from "../../admin/api/roles";
import InvitationForm from "../../invitations/components/InvitationForm";
import type { User } from "../../users/api/users.api";
import CheckButton from "../CheckButton";
import { Input } from "../Input";
import Modal from "../Modal";
import ProfileLine from "../ProfileLine";
import Section, { type LineInfos } from "../Section";
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
	const location = useLocation();
	const fetcher = useFetcher();
	const channels = useChat(
		useShallow((state) => Object.values(state.channels) as Channel[]),
	);

	const [showUser, setShowUser] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [showUsername, setShowUsername] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const openUsername = (): void => {
		setShowUsername(true);
	};
	const openPassword = (): void => {
		setShowPassword(true);
	};

	const clickOutsideRef = useClickOutside(
		useRef<HTMLDivElement>(null),
		() => {
			setShowUser(true);
		},
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

	useEffect(() => {
		if (fetcher.data) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowDelete(false);
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowPassword(false);
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowUsername(false);
		}
	}, [fetcher.data]);

	const Lines: LineInfos[] = [
		{
			name: "Username",
			value: user.userName,
			action: openUsername,
		},
		{ name: "Password", value: "***********", action: openPassword },
	];

	return (
		<>
			{showDelete && (
				<Modal
					title={`Delete your account ?`}
					onClose={() => {
						setShowDelete(false);
					}}
				>
					<p className="text-muted font-main font-light text-sm text-center w-100">
						This cannot be cancelled.
					</p>

					<div className="flex gap-5">
						<CheckButton
							type="submit"
							onClick={() => {
								void fetcher.submit(
									{ action: "/me/delete" },
									{
										method: "DELETE",
									},
								);
							}}
						>
							Yes
						</CheckButton>
						<CheckButton
							active
							activeCheck={false}
							onClick={() => {
								setShowDelete(false);
							}}
						>
							No
						</CheckButton>
					</div>
				</Modal>
			)}

			{showUsername && (
				<Modal
					width="w-90"
					title={`Change Username`}
					onClose={() => {
						setShowUsername(false);
					}}
				>
					<fetcher.Form
						className="flex flex-col items-center gap-5 w-7/10"
						method="PATCH"
						action="/me/username"
					>
						<Input
							maxLength={20}
							name="Username"
							required
							className="ring-0 focus:border-border border-border rounded-sm"
							type="text"
							placeholder="New Username"
						></Input>
						<CheckButton active type="submit">
							OK
						</CheckButton>
					</fetcher.Form>
				</Modal>
			)}

			{showPassword && (
				<Modal
					width="w-90"
					title={`Change Password`}
					onClose={() => {
						setShowPassword(false);
					}}
				>
					<fetcher.Form
						method="PATCH"
						className="flex flex-col items-center gap-5 w-8/10"
						action="/me/password"
					>
						<Input
							name="Current password"
							// maxLength={255}
							required
						></Input>
						<Input
							maxLength={255}
							// minLength={8}
							name="New password"
							required
							className="ring-0 focus:border-border border-border rounded-sm"
							type="text"
						></Input>

						<div className="w-30">
							<CheckButton active type="submit">
								OK
							</CheckButton>
						</div>
					</fetcher.Form>
				</Modal>
			)}

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
					<div className="border-b-2 border-t-2 border-border2 mt-auto font-main font-medium text-muted text-[14.5px]">
						{Boolean(user.role.permission & PermEnum.HandleUsers) &&
							(Boolean(
								user.role.permission & PermEnum.HandleUsers,
							) ||
								Boolean(
									user.role.permission & PermEnum.HandleRoles,
								)) && (
								<ul className=" pb-1 border-border2">
									{Boolean(
										user.role.permission &
										PermEnum.HandleUsers,
									) && (
										<ItemCategory
											to="/admin/users"
											icon={PiUser}
										>
											Users
										</ItemCategory>
									)}
									{Boolean(
										user.role.permission &
										PermEnum.HandleRoles,
									) && (
										<ItemCategory
											to="/admin/roles"
											icon={PiComputerTower}
										>
											Roles
										</ItemCategory>
									)}
								</ul>
							)}
					</div>
					{showUser && (
						<div
							ref={clickOutsideRef}
							className="flex items-center justify-center absolute bottom-15 left-55 flex-col border-border2 shadow-md bg-surface w-75 h-90 rounded-2xl"
						>
							<button
								type="button"
								onClick={() => {
									setShowUser(false);
								}}
								className="absolute right-5 top-3  text-muted hover:text-text text-3xl cursor-pointer ml-auto"
							>
								×
							</button>
							<div className="flex flex-col justify-center w-18/21 h-full gap-3 ">
								<ProfileLine
									changePicture
									size={3}
									user={user}
									edit
								></ProfileLine>
								<Section
									title="Account Info"
									lines={Lines}
								></Section>
								<div className="mt-2 flex justify-around gap-5">
									<CheckButton
										discrete
										onClick={() => {
											setShowDelete(true);
										}}
									>
										Delete Account
									</CheckButton>
									<CheckButton
										onClick={() => {
											void fetcher.submit(null, {
												action: "/me/logout",
												method: "DELETE",
											});
										}}
									>
										Logout
									</CheckButton>
								</div>
							</div>
						</div>
					)}
					<div className=" flex items-center gap-8  w-full">
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
