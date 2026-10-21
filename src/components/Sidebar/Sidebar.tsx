import { type JSX, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiMenuAlt2 } from "react-icons/hi";
import {
	PiBookOpen,
	PiCalendarBlank,
	PiChat,
	PiGear,
	PiHouse,
} from "react-icons/pi";
import { Link, useFetcher, useLocation } from "react-router";

import AdminSidebar from "@/admin/components/AdminSidebar";
import CategoryForm from "@/chat/components/CategoryForm";
import { useCategories, useChannels } from "@/chat/hooks/useChannels";
import { isWhitelisted } from "@/chat/utils/channel.util";
import Profile from "@/users/components/Profile";

import { PermEnum } from "../../admin/api/roles";
import InvitationForm from "../../invitations/components/InvitationForm";
import type { User } from "../../users/api/users";
import IconBtn from "../Button/IconBtn";
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

function Sidebar({ user }: { user: User }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const location = useLocation();
	const fetcher = useFetcher();
	const channelsQuery = useChannels();
	const categoriesQuery = useCategories();
	const categories = categoriesQuery.data ?? [];
	const dictCategories = Object.fromEntries(
		categories.map((cat) => [cat.id, cat]),
	);
	const channels = (channelsQuery.data ?? []).filter(
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

	const [showSide, setShowSide] = useState(false);
	const [showUser, setShowUser] = useState(false);

	// Drawer only matters below `lg`, where it closes on every navigation.
	const [prevPath, setPrevPath] = useState(location.pathname);
	if (prevPath !== location.pathname) {
		setPrevPath(location.pathname);
		setShowSide(false);
	}

	useEffect(() => {
		function handleKey(event: KeyboardEvent): void {
			if (event.key === "Escape" && showSide && !showUser) {
				setShowSide(false);
			}
		}
		document.addEventListener("keydown", handleKey);
		return (): void => {
			document.removeEventListener("keydown", handleKey);
		};
	}, [showSide, showUser]);

	const profileClickOutside = useCallback(() => {
		setShowUser(false);
	}, [setShowUser]);

	return (
		<>
			<button
				type="button"
				aria-controls="app-sidebar"
				aria-expanded={showSide}
				className="fixed z-30 top-3 left-2.5 inline-flex lg:hidden p-1.5 rounded-xl text-text2 bg-back/80 backdrop-blur-sm
				hover:bg-hover hover:text-text duration-120 cursor-pointer"
				onClick={() => {
					setShowSide(true);
				}}
			>
				<span className="sr-only">{t("sidebar.open")}</span>
				<HiMenuAlt2 size={24} />
			</button>

			<button
				type="button"
				tabIndex={-1}
				aria-label={t("sidebar.close")}
				className={`fixed inset-0 z-40 bg-black/25 lg:hidden duration-200 ${showSide ? "opacity-100" : "opacity-0 pointer-events-none"}`}
				onClick={() => {
					setShowSide(false);
				}}
			/>

			<aside
				id="app-sidebar"
				aria-label={t("sidebar.label")}
				className={`fixed top-0 left-0 z-40 w-64 max-w-[85vw] h-full bg-back2 transition-transform duration-200
					${showSide ? "translate-x-0 shadow-main" : "-translate-x-full"}
					lg:translate-x-0 lg:shadow-none`}
			>
				<div className="h-full flex flex-col px-3 py-4 border-e border-border space-y-3 font-main font-medium text-muted text-[14.5px]">
					<Link to="/" className="flex items-center ps-1 mb-5">
						<img
							src="/logo/icon-tile.svg"
							className="h-10 me-3 shrink-0"
						/>
						<div className="flex min-w-0 flex-col self-center">
							<span className="text-text font-head font-semibold text-[17px]">
								Keep Grouped
							</span>
							<span className="text-muted font-main font-normal text-sm whitespace-nowrap">
								{t("sidebar.subtitle")}
							</span>
						</div>
					</Link>
					{Boolean(user.role.permission & PermEnum.InviteUser) && (
						<InvitationForm className=""></InvitationForm>
					)}
					<ul className="mt-4">
						<ItemCategory to="/" icon={PiHouse}>
							{t("common.home")}
						</ItemCategory>
						<ItemCategory to="/calendar" icon={PiCalendarBlank}>
							{t("sidebar.calendar")}
						</ItemCategory>
						<ItemCategory to="/knowledge" icon={PiBookOpen}>
							{t("sidebar.knowledge")}
						</ItemCategory>
						<ItemCategory to="/messages" icon={PiChat}>
							{t("sidebar.messages")}
						</ItemCategory>
					</ul>

					<div className="flex-1 overflow-y-auto">
						<ul>
							<li className="flex justify-between items-center px-2 py-1.5 mt-3 text-[11px] text-muted font-bold tracking-wider uppercase whitespace-nowrap group">
								{t("sidebar.upcoming")}
								<span className="ml-auto">0</span>
							</li>
						</ul>

						<div className="relative flex justify-between items-center px-2 py-1.5 mt-3 text-[11px] text-muted font-bold tracking-wider uppercase whitespace-nowrap group">
							{t("sidebar.channels")}{" "}
							{Boolean(
								user.role.permission & PermEnum.HandleChannels,
							) && <CategoryForm></CategoryForm>}
						</div>
						<ul>
							{channelsQuery.isPending ||
								categoriesQuery.isPending ? (
								<ChannelListSkeleton />
							) : (
								<>
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
								</>
							)}
						</ul>
					</div>
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
					<div className="relative flex items-center gap-8  w-full h-20">
						<ProfileLine user={user} status edit size={2} />
						<IconBtn
							discrete
							icon={PiGear}
							title="Settings"
							active={showUser}
							className="absolute right-0 top-1/2 -translate-1/2"
							onClick={() => {
								setShowUser(true);
							}}
						/>

					</div>
				</div>
			</aside>
		</>
	);
}

export default Sidebar;
