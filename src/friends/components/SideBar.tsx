import { useRef, useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { PiHourglass, PiPlus, PiProhibit, PiUsers, PiUsersBold } from "react-icons/pi";

import { SearchBar } from "@/components/Input/Search";
import { useScrollPagination } from "@/hooks/usePagination";

import { RelationshipState } from "../api/relationship.api";
import { useConversations } from "../hooks/useConversations";
import { useRelationships } from "../hooks/useRelationships";
import { conversationTitle, lastActivity, matchesSearch } from "../utils/friends.util";
import NewConversationModal from "./NewConversationModal";
import { SideBarChatItem } from "./SideBarChatItem";
import { SideBarItem } from "./SideBarItem";

export function ConversationSideBar(): JSX.Element {
	const containerRef = useRef(null);
	const [search, setSearch] = useState("");
	const [showNewConv, setShowNewConv] = useState(false);

	const { data, isPending, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useConversations();
	const { data: rels } = useRelationships();
	const onScroll = useScrollPagination({
		containerRef,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		direction: "down",
		enabled: !isPending,
	});

	const seen = new Set<string>();
	const convs = (data?.pages.flat() ?? [])
		.filter(cn => !seen.has(cn.id) && Boolean(seen.add(cn.id)))
		.filter(cn => matchesSearch(conversationTitle(cn, rels), search))
		.toSorted((lhs, rhs) => lastActivity(rhs) - lastActivity(lhs));
	const incoming = rels?.filter((rel) => rel.type === RelationshipState.PendingResponse).length ?? 0;

	return (
		<aside
			id="sidebar"
			className="fixed top-0 left-64 z-20 w-64 h-full max-h-full transition-transform -translate-x-full sm:translate-x-0
				bg-back3 border border-border"
		>
			<div className="h-full flex flex-col px-3 py-4 space-y-3 font-main font-medium text-muted text-[14.5px] overflow-hidden">
				<h1 className="font-semibold tracking-tight text-xl inline-flex justify-center text-text">
					Private Messages
				</h1>

				<SearchBar
					name="Search conversation"
					placeholder="Search conversation"
					className="bg-back!"
					value={search}
					onChange={(ev) => { setSearch(ev.target.value); }}
				/>

				<div className="relative flex justify-between items-center px-2 py-1.5 mt-3 text-[11px] text-muted font-bold tracking-wider uppercase group">
					Friends
				</div>

				<ul className="w-full">
					<SideBarItem icon={PiUsers} to="/messages/all">All</SideBarItem>
					<SideBarItem icon={PiUsersBold} to="/messages/online">Online</SideBarItem>
					<SideBarItem icon={PiHourglass} to="/messages/pending" badge={incoming}>Pending</SideBarItem>
					<SideBarItem icon={PiProhibit} to="/messages/blocked">Blocked</SideBarItem>
				</ul>

				<div className="relative flex justify-between items-center px-2 py-1.5 mt-3 text-[11px] text-muted font-bold tracking-wider uppercase group">
					Messages
					<button
						type="button"
						title="New conversation"
						className="ml-auto p-0.5 cursor-pointer text-muted hover:text-text"
						onClick={() => { setShowNewConv(true); }}
					>
						<PiPlus size={14} />
					</button>
				</div>
				<ul className="flex-1 overflow-hidden overflow-y-auto w-full" onScroll={onScroll} ref={containerRef}>
					{isPending && <li className="px-2 text-[13px]">Loading...</li>}
					{error && <li className="px-2 text-[13px] text-error">Couldn't load conversations.</li>}
					{!isPending && !error && convs.length === 0 && (
						<li className="px-2 text-[13px]">{search ? "No match." : "No conversation yet."}</li>
					)}
					{convs.map((conv) => (
						<SideBarChatItem key={conv.id} conv={conv} rels={rels}></SideBarChatItem>
					))}
				</ul>
			</div>

			{showNewConv && <NewConversationModal onClose={() => { setShowNewConv(false); }} />}
		</aside>
	);
}
