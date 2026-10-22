import { type JSX, useState } from "react";
import { PiChatCircleDots, PiUserPlus, PiUsers } from "react-icons/pi";
import { Link, NavLink } from "react-router";

import CheckButton from "@/components/Button/CheckButton";
import IconBtn from "@/components/Button/IconBtn";
import { SearchBar } from "@/components/Input/Search";

import { type Relationship, RelationshipState } from "../api/relationship.api";
import { useRelationships } from "../hooks/useRelationships";
import { isBlocked, isFriend, matchesSearch, relationName } from "../utils/friends.util";
import { useIsOnline } from "./ActivityLabel";
import AddFriendModal from "./AddFriendModal";
import BackToList, { HEADER_PADDING } from "./BackToList";
import FriendRow from "./FriendRow";
import {
	EmptyState,
	OnlineFriends,
	PendingRequestsBanner,
	RecentConversations,
	SectionTitle,
} from "./FriendsWidgets";
import NewConversationModal from "./NewConversationModal";
import { FriendListSkeleton, OnlineFriendsSkeleton } from "./Skeletons";

export type FriendsFilter = "all" | "online" | "pending" | "blocked";

const TABS: [FriendsFilter, string][] = [
	["online", "Online"],
	["all", "All"],
	["pending", "Pending"],
	["blocked", "Blocked"],
];

function FriendsHeader(): JSX.Element {
	const { data: rels } = useRelationships();
	const incoming = rels?.filter((rel) => rel.type === RelationshipState.PendingResponse).length ?? 0;
	const [modal, setModal] = useState<"add" | "conv" | null>(null);

	return (
		<div className={`flex flex-none flex-wrap items-center gap-x-3 gap-y-2 border-b border-border py-3 ${HEADER_PADDING}`}>
			<BackToList />
			<Link to="/messages" className="flex items-center gap-2 font-head text-[17px] font-[650] text-text">
				<PiUsers size={20} className="text-muted" />
				Friends
			</Link>
			<span className="hidden xl:block w-px h-5 bg-border mx-1" />
			<nav className="order-last w-full flex gap-1 overflow-x-auto xl:order-0 xl:w-auto">
				{TABS.map(([to, label]) => (
					<NavLink
						key={to}
						to={`/messages/${to}`}
						className={({ isActive }) => [
							"inline-flex shrink-0 items-center gap-1.5 px-3 py-1 rounded-full text-[14px] font-semibold duration-120",
							isActive ? "bg-accent-soft text-text" : "text-text2 hover:bg-hover hover:text-text",
						].join(" ")}
					>
						{label}
						{to === "pending" && incoming > 0 && (
							<span className="min-w-5 px-1.5 rounded-full bg-accent text-accent-text text-[11px] leading-5 text-center">
								{incoming}
							</span>
						)}
					</NavLink>
				))}
			</nav>
			<span className="flex-1" />
			<IconBtn
				icon={PiChatCircleDots}
				title="New conversation"
				onClick={() => { setModal("conv"); }}
			/>
			<CheckButton active activeCheck={false} title="Add friend" onClick={() => { setModal("add"); }}>
				<PiUserPlus size={18} />
				<span className="hidden sm:inline">Add friend</span>
			</CheckButton>

			{modal === "add" && <AddFriendModal onClose={() => { setModal(null); }} />}
			{modal === "conv" && <NewConversationModal onClose={() => { setModal(null); }} />}
		</div>
	);
}

function RelationList({ title, rels }: { title: string; rels: Relationship[] }): JSX.Element | null {
	if (rels.length === 0) { return null; }
	return (
		<section>
			<SectionTitle>{title} — {rels.length}</SectionTitle>
			<ul className="flex flex-col rounded-xl border border-border bg-surface">
				{rels.map((rel) => <FriendRow key={rel.id} rel={rel} />)}
			</ul>
		</section>
	);
}

function FriendsList({ filter }: { filter: FriendsFilter }): JSX.Element {
	const { data: rels, isPending: loading, error } = useRelationships();
	const isOnline = useIsOnline();
	const [search, setSearch] = useState("");

	if (loading) {
		return <FriendListSkeleton />;
	}
	if (error) {
		return <EmptyState title="Couldn't load your friends">{error.message}</EmptyState>;
	}

	const matching = rels
		.filter((rel) => matchesSearch(relationName(rel), search) || matchesSearch(rel.user.userName, search))
		.toSorted((lhs, rhs) => relationName(lhs).localeCompare(relationName(rhs)));

	let sections: [string, Relationship[]][];
	let empty: [string, string];
	switch (filter) {
		case "online":
			sections = [["Online", matching.filter((rel) => isFriend(rel) && isOnline(rel.user.id))]];
			empty = ["Nobody's around", "None of your friends are online right now."];
			break;
		case "pending":
			sections = [
				["Incoming", matching.filter((rel) => rel.type === RelationshipState.PendingResponse)],
				["Outgoing", matching.filter((rel) => rel.type === RelationshipState.PendingRequest)],
			];
			empty = ["No pending requests", "Friend requests you send or receive will show up here."];
			break;
		case "blocked":
			sections = [["Blocked", matching.filter(isBlocked)]];
			empty = ["No blocked users", "Users you block can't send you requests or messages."];
			break;
		case "all":
		default:
			sections = [["All friends", matching.filter(isFriend)]];
			empty = ["No friends yet", "Use “Add friend” to send a request to another member."];
	}

	const isEmpty = sections.every(([, list]) => list.length === 0);

	return (
		<div className="flex flex-col gap-5">
			<SearchBar
				name="search"
				placeholder="Search"
				value={search}
				onChange={(ev) => { setSearch(ev.target.value); }}
			/>
			{isEmpty
				? <EmptyState title={search ? "No results" : empty[0]}>{search ? `Nobody matches “${search}”.` : empty[1]}</EmptyState>
				: sections.map(([title, list]) => <RelationList key={title} title={title} rels={list} />)}
		</div>
	);
}

export function FriendsHome(): JSX.Element {
	const { data: rels, isPending } = useRelationships();

	if (isPending) { return <OnlineFriendsSkeleton />; }

	const friends = (rels ?? []).filter(isFriend);
	const outgoing = (rels ?? []).filter((rel) => rel.type === RelationshipState.PendingRequest).length;

	return (
		<div className="flex flex-col gap-8">
			<PendingRequestsBanner />
			{friends.length === 0 ? (
				<EmptyState title="Welcome to your private space">
					Add friends to chat with them directly or create small groups.
					{outgoing > 0 && ` You have ${outgoing} request${outgoing > 1 ? "s" : ""} waiting for an answer.`}
				</EmptyState>
			) : (<>
				<OnlineFriends />
				<RecentConversations />
			</>)}
		</div>
	);
}

export default function FriendsPage({ filter }: { filter: FriendsFilter | null }): JSX.Element {
	return (
		<div className="flex flex-col w-full h-full min-h-0">
			<FriendsHeader />
			<div className="flex-1 min-h-0 overflow-y-auto">
				<div className="max-w-3xl mx-auto px-4 sm:px-5.5 py-6">
					{filter ? <FriendsList filter={filter} /> : <FriendsHome />}
				</div>
			</div>
		</div>
	);
}
