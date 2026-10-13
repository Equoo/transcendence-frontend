import { type JSX, type ReactNode, useState } from "react";
import { PiCaretRight, PiChatCircleDots, PiUserPlus, PiUsers } from "react-icons/pi";
import { Link, NavLink } from "react-router";

import CheckButton from "@/components/Button/CheckButton";
import IconBtn from "@/components/Button/IconBtn";
import { SearchBar } from "@/components/Input/Search";
import ProfilePic from "@/components/Profile/ProfilePic";

import { type Relationship, RelationshipState } from "../api/relationship.api";
import { useConversations, useStartConversation } from "../hooks/useConversations";
import { useRelationships } from "../hooks/useRelationships";
import {
	conversationTitle,
	isBlocked,
	isFriend,
	isPending,
	matchesSearch,
	relationName,
} from "../utils/friends.util";
import { useIsOnline } from "./ActivityLabel";
import AddFriendModal from "./AddFriendModal";
import ConversationAvatar from "./ConversationAvatar";
import FriendRow from "./FriendRow";
import NewConversationModal from "./NewConversationModal";

export type FriendsFilter = "all" | "online" | "pending" | "blocked";

const TABS: [FriendsFilter, string][] = [
	["online", "Online"],
	["all", "All"],
	["pending", "Pending"],
	["blocked", "Blocked"],
];

function SectionTitle({ children }: { children: ReactNode }): JSX.Element {
	return (
		<h3 className="px-1 pb-2 text-[11px] text-muted font-bold tracking-wider uppercase">
			{children}
		</h3>
	);
}

function FriendsHeader(): JSX.Element {
	const { data: rels } = useRelationships();
	const incoming = rels?.filter((rel) => rel.type === RelationshipState.PendingResponse).length ?? 0;
	const [modal, setModal] = useState<"add" | "conv" | null>(null);

	return (
		<div className="flex flex-none flex-wrap items-center gap-3 border-b border-border px-5.5 py-3">
			<Link to="/messages" className="flex items-center gap-2 font-head text-[17px] font-[650] text-text">
				<PiUsers size={20} className="text-muted" />
				Friends
			</Link>
			<span className="w-px h-5 bg-border mx-1" />
			<nav className="flex flex-wrap gap-1">
				{TABS.map(([to, label]) => (
					<NavLink
						key={to}
						to={`/messages/${to}`}
						className={({ isActive }) => [
							"inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[14px] font-semibold duration-120",
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
			<CheckButton active activeCheck={false} onClick={() => { setModal("add"); }}>
				<PiUserPlus size={18} />
				Add friend
			</CheckButton>

			{modal === "add" && <AddFriendModal onClose={() => { setModal(null); }} />}
			{modal === "conv" && <NewConversationModal onClose={() => { setModal(null); }} />}
		</div>
	);
}

function EmptyState({ title, children }: { title: string; children?: ReactNode }): JSX.Element {
	return (
		<div className="flex flex-col items-center gap-2 py-16 text-center">
			<div className="flex items-center justify-center size-14 rounded-2xl bg-accent-soft text-accent mb-2">
				<PiUsers size={28} />
			</div>
			<h2 className="font-head font-semibold text-lg text-text">{title}</h2>
			{children && <p className="text-sm text-text2 max-w-sm">{children}</p>}
		</div>
	);
}

function RelationList({ title, rels }: { title: string; rels: Relationship[] }): JSX.Element | null {
	if (rels.length === 0) { return null; }
	return (
		<section>
			<SectionTitle>{title} — {rels.length}</SectionTitle>
			<ul className="flex flex-col rounded-base border border-border bg-surface">
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
		return <p className="text-muted text-sm text-center py-10">Loading friends...</p>;
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

function OnlineFriendCard({ rel }: { rel: Relationship }): JSX.Element {
	const startConv = useStartConversation();
	return (
		<button
			type="button"
			disabled={startConv.isPending}
			onClick={() => { startConv.mutate({ recipients: [rel.user.id] }); }}
			className="flex flex-col items-center gap-2 p-4 rounded-base border border-border bg-surface cursor-pointer
				hover:-translate-y-0.5 hover:shadow-main duration-120"
		>
			<ProfilePic user={rel.user} size={2} status />
			<span className="text-text text-[14px] font-semibold truncate max-w-full">{relationName(rel)}</span>
		</button>
	);
}

function FriendsHome(): JSX.Element {
	const { data: rels, isPending: loading } = useRelationships();
	const { data: convPages } = useConversations();
	const isOnline = useIsOnline();

	if (loading) {
		return <p className="text-muted text-sm text-center py-10">Loading...</p>;
	}

	const friends = (rels ?? []).filter(isFriend);
	const online = friends.filter((rel) => isOnline(rel.user.id));
	const incoming = (rels ?? []).filter((rel) => rel.type === RelationshipState.PendingResponse);
	const outgoing = (rels ?? []).filter(isPending).length - incoming.length;
	const seen = new Set<string>();
	const recent = (convPages?.pages.flat() ?? [])
		.filter((cn) => !seen.has(cn.id) && Boolean(seen.add(cn.id)))
		.slice(0, 6);

	return (
		<div className="flex flex-col gap-8">
			{incoming.length > 0 && (
				<Link
					to="/messages/pending"
					className="flex items-center gap-4 p-4 rounded-base border border-accent/30 bg-accent-soft hover:brightness-98 duration-120"
				>
					<div className="flex -space-x-3">
						{incoming.slice(0, 3).map((rel, idx) => (
							<ProfilePic key={rel.id} user={rel.user} size={1} idx={3 - idx} />
						))}
					</div>
					<div className="flex flex-col flex-1">
						<span className="text-text font-semibold">
							{incoming.length} pending friend request{incoming.length > 1 ? "s" : ""}
						</span>
						<span className="text-text2 text-sm">
							{incoming.slice(0, 3).map(relationName).join(", ")}
							{incoming.length > 3 && ` and ${incoming.length - 3} more`}
						</span>
					</div>
					<PiCaretRight className="text-text2" />
				</Link>
			)}

			{friends.length === 0 ? (
				<EmptyState title="Welcome to your private space">
					Add friends to chat with them directly or create small groups.
					{outgoing > 0 && ` You have ${outgoing} request${outgoing > 1 ? "s" : ""} waiting for an answer.`}
				</EmptyState>
			) : (
				<section>
					<SectionTitle>Online now — {online.length}</SectionTitle>
					{online.length === 0 ? (
						<p className="text-sm text-text2 px-1">None of your {friends.length} friends are online right now.</p>
					) : (
						<div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3">
							{online.map((rel) => <OnlineFriendCard key={rel.id} rel={rel} />)}
						</div>
					)}
				</section>
			)}

			{recent.length > 0 && (
				<section>
					<SectionTitle>Recent conversations</SectionTitle>
					<div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
						{recent.map((conv) => (
							<Link
								key={conv.id}
								to={`/messages/${conv.id}`}
								className="flex items-center gap-3 p-3 rounded-base border border-border bg-surface
									hover:-translate-y-0.5 hover:shadow-main duration-120"
							>
								<ConversationAvatar conv={conv} />
								<div className="flex flex-col min-w-0">
									<span className="text-text text-[14px] font-semibold truncate">{conversationTitle(conv, rels)}</span>
									<span className="text-muted text-[13px] truncate">
										{conv.lastMessage
											? `${conv.lastMessage.sender.userName}: ${conv.lastMessage.content}`
											: "No messages yet"}
									</span>
								</div>
							</Link>
						))}
					</div>
				</section>
			)}
		</div>
	);
}

export default function FriendsPage({ filter }: { filter: FriendsFilter | null }): JSX.Element {
	return (
		<div className="flex flex-col w-full h-full min-h-0">
			<FriendsHeader />
			<div className="flex-1 min-h-0 overflow-y-auto">
				<div className="max-w-3xl mx-auto px-5.5 py-6">
					{filter ? <FriendsList filter={filter} /> : <FriendsHome />}
				</div>
			</div>
		</div>
	);
}
