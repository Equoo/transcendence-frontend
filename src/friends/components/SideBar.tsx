import { useRef } from "react";
import type { JSX } from "react/jsx-runtime";
import { PiHourglass, PiUsers, PiUsersBold } from "react-icons/pi";

import { SearchBar } from "@/components/Input/Search";
import { useScrollPagination } from "@/hooks/usePagination";

import { useConversations } from "../hooks/useConversations";
import { SideBarChatItem } from "./SideBarChatItem";
import { SideBarItem } from "./SideBarItem";

export function ConversationSideBar(): JSX.Element {
	const containerRef = useRef(null);

	const { data, isPending, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useConversations();
	const onScroll = useScrollPagination({
		containerRef,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		direction: "down",
		enabled: !isPending,
	});

	if (isPending) { return <div>LOADING</div>; }
	if (error) { return <div>ERROR</div>; }

	const seen = new Set<string>();
	const convs = data.pages.toReversed().flat()
		.filter(cn => !seen.has(cn.id) && Boolean(seen.add(cn.id)));

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

				<SearchBar name="Search conversation" className="bg-back!"></SearchBar>

				<div className="relative flex justify-between items-center px-2 py-1.5 mt-3 text-[11px] text-muted font-bold tracking-wider uppercase group">
					Messages
				</div>
				<ul className="flex-1 overflow-hidden overflow-y-auto w-full" onScroll={onScroll} ref={containerRef}>
					{convs.map((conv) => (
						<SideBarChatItem key={conv.id} conv={conv}></SideBarChatItem>
					))}
				</ul>

				<div className="relative flex justify-between items-center px-2 py-1.5 mt-3 text-[11px] text-muted font-bold tracking-wider uppercase group">
					Friends
				</div>

				<ul className="w-full">
					<SideBarItem icon={PiUsers} to="/messages/all">All</SideBarItem>
					<SideBarItem icon={PiUsersBold} to="/messages/online">Online</SideBarItem>
					<SideBarItem icon={PiHourglass} to="/messages/pending">Pending</SideBarItem>
				</ul>
			</div >
		</aside >
	);
}

