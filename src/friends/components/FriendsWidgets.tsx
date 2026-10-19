import type { JSX, ReactNode } from "react";
import { PiCaretRight, PiUsers } from "react-icons/pi";
import { Link } from "react-router";

import ProfilePic from "@/components/Profile/ProfilePic";

import type { Conversation } from "../api/conversations.api";
import { type Relationship, RelationshipState } from "../api/relationship.api";
import { useConversations, useStartConversation } from "../hooks/useConversations";
import { useRelationships } from "../hooks/useRelationships";
import { conversationTitle, isFriend, lastActivity, relationName } from "../utils/friends.util";
import { useIsOnline } from "./ActivityLabel";
import ConversationAvatar from "./ConversationAvatar";
import { OnlineFriendsSkeleton, RecentConversationsSkeleton } from "./Skeletons";

export function SectionTitle({ children }: { children: ReactNode }): JSX.Element {
	return (
		<h3 className="px-1 pb-2 text-[11px] text-muted font-bold tracking-wider uppercase">
			{children}
		</h3>
	);
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }): JSX.Element {
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

export function useRecentConversations(limit: number): {
	recent: Conversation[];
	isPending: boolean;
} {
	const { data: convPages, isPending } = useConversations();
	const seen = new Set<string>();
	const recent = (convPages?.pages.flat() ?? [])
		.filter((cn) => !seen.has(cn.id) && Boolean(seen.add(cn.id)))
		.toSorted((lhs, rhs) => lastActivity(rhs) - lastActivity(lhs))
		.slice(0, limit);
	return { recent, isPending };
}

export function PendingRequestsBanner(): JSX.Element | null {
	const { data: rels } = useRelationships();
	const incoming = (rels ?? []).filter((rel) => rel.type === RelationshipState.PendingResponse);

	if (incoming.length === 0) { return null; }
	return (
		<Link
			to="/messages/pending"
			className="flex items-center gap-4 p-4 rounded-base border border-accent/30 bg-accent-soft hover:brightness-98 duration-120"
		>
			<div className="flex -space-x-3">
				{incoming.slice(0, 3).map((rel, idx) => (
					<ProfilePic key={rel.id} user={rel.user} size={1} idx={3 - idx} />
				))}
			</div>
			<div className="flex flex-col flex-1 min-w-0">
				<span className="text-text font-semibold">
					{incoming.length} pending friend request{incoming.length > 1 ? "s" : ""}
				</span>
				<span className="text-text2 text-sm truncate">
					{incoming.slice(0, 3).map(relationName).join(", ")}
					{incoming.length > 3 && ` and ${incoming.length - 3} more`}
				</span>
			</div>
			<PiCaretRight className="text-text2" />
		</Link>
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

export function OnlineFriends({ limit }: { limit?: number }): JSX.Element {
	const { data: rels, isPending } = useRelationships();
	const isOnline = useIsOnline();

	if (isPending) { return <OnlineFriendsSkeleton />; }

	const friends = (rels ?? []).filter(isFriend);
	const online = friends.filter((rel) => isOnline(rel.user.id));
	const outgoing = (rels ?? []).filter((rel) => rel.type === RelationshipState.PendingRequest).length;

	if (friends.length === 0) {
		return (
			<EmptyState title="Welcome to your private space">
				Add friends to chat with them directly or create small groups.
				{outgoing > 0 && ` You have ${outgoing} request${outgoing > 1 ? "s" : ""} waiting for an answer.`}
			</EmptyState>
		);
	}
	return (
		<section>
			<SectionTitle>Online now — {online.length}</SectionTitle>
			{online.length === 0 ? (
				<p className="text-sm text-text2 px-1">None of your {friends.length} friends are online right now.</p>
			) : (
				<div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3">
					{online.slice(0, limit).map((rel) => <OnlineFriendCard key={rel.id} rel={rel} />)}
				</div>
			)}
		</section>
	);
}

export function RecentConversations({ limit = 6, showEmpty = false }: {
	limit?: number;
	showEmpty?: boolean;
}): JSX.Element | null {
	const { data: rels } = useRelationships();
	const { recent, isPending } = useRecentConversations(limit);

	if (isPending) { return <RecentConversationsSkeleton />; }
	if (recent.length === 0 && !showEmpty) { return null; }
	return (
		<section>
			<SectionTitle>Recent conversations</SectionTitle>
			{recent.length === 0 ? (
				<p className="text-sm text-text2 px-1">No conversation yet.</p>
			) : (
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
			)}
		</section>
	);
}
