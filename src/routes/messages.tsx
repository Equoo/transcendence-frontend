import { type JSX, useRef } from "react";
import { NavLink } from "react-router";

import { SearchBar } from "@/components/Input/Search";
import ProfilePic from "@/components/Profile/ProfilePic";
import { useConversations } from "@/friends/hooks/useConversations";
import { useScrollPagination } from "@/hooks/usePagination";
import type { User } from "@/users/api/users";
import { useUser } from "@/users/hooks/users";

function PrivateChatItem({
	chatId,
	user,
}: {
	chatId: string;
	user: User;
}): JSX.Element {
	const to = `/messages/${chatId}`;

	return (
		<li
			key={chatId}
			className=""
		>
			<NavLink
				key={chatId}
				to={to}
				className={({ isActive }) =>
					[
						"flex gap-2 px-2 py-1.5 text-[14.5px] rounded-base group duration-120",
						isActive
							? "bg-accent-soft text-text"
							: "hover:bg-back hover:text-text",
					].join(" ")
				}
			>
				{({ isActive, isPending }) => (
					<>
						{/* {isPending && ( */}
						{/* 	<TbLoader2 className="animate-spin min-w-5" /> */}
						{/* )} */}
						<ProfilePic user={user} size={1} status></ProfilePic>
						<div className="flex truncate flex-col justify-center">
							<p className="text-text text-[14px] font-semibold">{user.userName}</p>
							<p className="text-muted text-[14px] block truncate min-w-0">{user.userName}: last message blbalba lfe freg lg er</p>
						</div>
					</>
				)}
			</NavLink>
		</li>
	);
}

export default function Messages(): JSX.Element {
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

	const user = useUser();
	if (!user) { return (<></>); }

	if (isPending) { return <div>LOADING</div>; }
	if (error) { return <div>ERROR</div>; }

	const seen = new Set<string>();
	const convs = data.pages.toReversed().flat()
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		.filter(cn => !seen.has(cn.id) && seen.add(cn.id));


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
						<PrivateChatItem key={conv.id} chatId={conv.id} user={conv.recipients[0]}></PrivateChatItem>
					))}
				</ul>

				<div className="relative flex justify-between items-center px-2 py-1.5 mt-3 text-[11px] text-muted font-bold tracking-wider uppercase group">
					Friends
				</div>

				<div className="flex items-center gap-8 w-full">
				</div>
			</div >
		</aside >

	);
}
