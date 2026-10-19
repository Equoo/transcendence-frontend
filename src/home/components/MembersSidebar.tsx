import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiChatCircleDots, PiX } from "react-icons/pi";

import { ActivityEnum, useActivity } from "@/activity/hooks/activity.hook";
import IconBtn from "@/components/Button/IconBtn";
import { SearchBar } from "@/components/Input/Search";
import ProfilePic from "@/components/Profile/ProfilePic";
import Promisable from "@/components/Promisable";
import type { Relationship } from "@/friends/api/relationship.api";
import { ConversationListSkeleton } from "@/friends/components/Skeletons";
import { useStartConversation } from "@/friends/hooks/useConversations";
import { useRelationships } from "@/friends/hooks/useRelationships";
import { matchesSearch } from "@/friends/utils/friends.util";
import type { User } from "@/users/api/users";

const GROUPS: [ActivityEnum, string][] = [
	[ActivityEnum.Online, "home.status.online"],
	[ActivityEnum.Busy, "home.status.busy"],
	[ActivityEnum.Afk, "home.status.away"],
	[ActivityEnum.Offline, "home.status.offline"],
];

function displayName(user: User, rels?: Relationship[]): string {
	return rels?.find((rel) => rel.user.id === user.id)?.nickname ?? user.userName;
}

function MemberRow({ user, name, isSelf, offline }: {
	user: User;
	name: string;
	isSelf: boolean;
	offline: boolean;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const startConv = useStartConversation();

	return (
		<li className={`flex items-center gap-2.5 px-2 py-1.5 rounded-base group hover:bg-hover duration-120 ${offline ? "opacity-55 hover:opacity-100" : ""}`}>
			<ProfilePic user={user} size={1} status={!offline} />
			<div className="flex flex-col min-w-0 flex-1">
				<p className="text-text text-[14px] font-semibold truncate">
					{name}
					{isSelf && <span className="ml-1.5 text-muted font-normal text-[12.5px]">{t("home.you")}</span>}
				</p>
				<p className="text-muted text-[12.5px] truncate">{user.role.name}</p>
			</div>
			{!isSelf && (
				<IconBtn
					discrete
					icon={PiChatCircleDots}
					title={t("home.sendMessage")}
					disabled={startConv.isPending}
					className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
					onClick={() => { startConv.mutate({ recipients: [user.id] }); }}
				/>
			)}
		</li>
	);
}

function MemberList({ users, search }: { users: User[]; search: string }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const activity = useActivity();
	const { data: rels } = useRelationships();

	const members = users
		.map((user) => ({ user, name: displayName(user, rels) }))
		.filter(({ user, name }) => matchesSearch(name, search) || matchesSearch(user.userName, search))
		.toSorted((lhs, rhs) => lhs.name.localeCompare(rhs.name));

	if (members.length === 0) {
		return <p className="px-2 text-[13px] text-muted">{t("home.noMembers")}</p>;
	}
	return (
		<div className="flex flex-col gap-4">
			{GROUPS.map(([status, label]) => {
				const group = members.filter(({ user }) => activity.getActivity(user.id) === status);
				if (group.length === 0) { return null; }
				return (
					<section key={status}>
						<h3 className="px-2 pb-1 text-[11px] text-muted font-bold tracking-wider uppercase">
							{t(label)} — {group.length}
						</h3>
						<ul className="flex flex-col">
							{group.map(({ user, name }) => (
								<MemberRow
									key={user.id}
									user={user}
									name={name}
									isSelf={user.id === activity.selfId}
									offline={status === ActivityEnum.Offline}
								/>
							))}
						</ul>
					</section>
				);
			})}
		</div>
	);
}

export function useOnlineCount(users: User[]): number {
	const activity = useActivity();
	return users.filter((user) => activity.getActivity(user.id) !== ActivityEnum.Offline).length;
}

function MembersCount({ users }: { users: User[] }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const online = useOnlineCount(users);
	return (
		<span className="text-[12.5px] text-good font-medium">
			{t("home.onlineCount", { online, total: users.length })}
		</span>
	);
}

export default function MembersSidebar({ users, open, onClose }: {
	users: Promise<User[]>;
	open: boolean;
	onClose: () => void;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [search, setSearch] = useState("");

	return (<>
		<button
			type="button"
			aria-label={t("home.closeMembers")}
			className={`fixed inset-0 z-30 bg-black/20 xl:hidden duration-200 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
			onClick={onClose}
		/>
		<aside
			className={[
				"fixed top-0 right-0 z-40 h-full w-72 bg-back3 border-l border-border transition-transform duration-200",
				"xl:static xl:z-auto xl:transition-none",
				open ? "translate-x-0 xl:flex" : "translate-x-full xl:hidden",
				"flex flex-col shrink-0",
			].join(" ")}
		>
			<div className="flex flex-none items-center gap-2 px-4 pt-4 pb-3">
				<div className="flex flex-col min-w-0 flex-1">
					<h2 className="font-head font-semibold text-[17px] text-text">{t("home.members")}</h2>
					<Promisable data={users} skeleton={<span className="h-3 my-1 w-20 rounded bg-border animate-pulse" />}>
						{(data) => <MembersCount users={data} />}
					</Promisable>
				</div>
				<IconBtn discrete icon={PiX} title={t("home.closeMembers")} onClick={onClose} />
			</div>
			<div className="flex-none px-3 pb-3">
				<SearchBar
					name="search-members"
					placeholder={t("home.searchMembers")}
					className="bg-back!"
					value={search}
					onChange={(ev) => { setSearch(ev.target.value); }}
				/>
			</div>
			<div className="flex-1 min-h-0 overflow-y-auto px-2 pb-4">
				<Promisable data={users} skeleton={<ul><ConversationListSkeleton count={8} /></ul>}>
					{(data) => <MemberList users={data} search={search} />}
				</Promisable>
			</div>
		</aside>
	</>);
}
