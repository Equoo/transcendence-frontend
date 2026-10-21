import { type JSX, useState } from "react";
import { PiHourglass, PiSignOut, PiUserPlus } from "react-icons/pi";

import ChannelChat from "@/chat/components/ChannelChat";
import IconBtn from "@/components/Button/IconBtn";
import ConfirmModal from "@/components/Modal/ConfirmModal";

import type { Conversation } from "../api/conversations.api";
import { RelationshipState } from "../api/relationship.api";
import { useConversation, useLeaveConversation } from "../hooks/useConversations";
import { useAddFriend, useRelationship, useRelationships } from "../hooks/useRelationships";
import { conversationTitle, isGroup } from "../utils/friends.util";
import ActivityLabel from "./ActivityLabel";
import BackToList, { HEADER_PADDING } from "./BackToList";
import ConversationAvatar from "./ConversationAvatar";
import { ConversationChatSkeleton } from "./Skeletons";

function DirectActions({ conv }: { conv: Conversation }): JSX.Element | null {
	const [other] = conv.recipients;
	const rel = useRelationship(other.id);
	const add = useAddFriend();

	if (!rel || rel.type === RelationshipState.PendingResponse) {
		return (
			<IconBtn
				discrete
				icon={PiUserPlus}
				title={rel ? "Accept friend request" : "Add friend"}
				disabled={add.isPending}
				onClick={() => { add.mutate(other.id); }}
			/>
		);
	}
	if (rel.type === RelationshipState.PendingRequest) {
		return <IconBtn discrete disabled icon={PiHourglass} title="Friend request sent" />;
	}
	return null;
}

function GroupActions({ conv, title }: { conv: Conversation; title: string }): JSX.Element {
	const leave = useLeaveConversation();
	const [confirm, setConfirm] = useState(false);

	return (<>
		<IconBtn discrete icon={PiSignOut} title="Leave group" onClick={() => { setConfirm(true); }} />
		{confirm && (
			<ConfirmModal
				title="Leave group"
				confirmLabel="Leave"
				danger
				pending={leave.isPending}
				onClose={() => { setConfirm(false); }}
				onConfirm={() => { leave.mutate(conv.id); }}
				description={<>You will stop receiving messages from “{title}”. Someone will have to add you back to rejoin.</>}
			/>
		)}
	</>);
}

function ChatHeader({ conv }: { conv: Conversation }): JSX.Element {
	const { data: rels } = useRelationships();
	const title = conversationTitle(conv, rels);
	const group = isGroup(conv);

	return (
		<div className={`flex flex-none items-center gap-3 border-b border-border py-2.5 ${HEADER_PADDING}`}>
			<BackToList />
			<ConversationAvatar conv={conv} />
			<div className="flex flex-col min-w-0">
				<div className="font-head text-[17px] font-[650] text-text truncate">{title}</div>
				<div className="text-[12.5px] text-muted truncate">
					{group
						? `${conv.recipients.length + 1} members`
						: <ActivityLabel userId={conv.recipients[0].id} />}
				</div>
			</div>
			<span className="flex-1" />
			{group ? <GroupActions conv={conv} title={title} /> : <DirectActions conv={conv} />}
		</div>
	);
}

export default function ConversationChat({ chatId }: { chatId: string }): JSX.Element {
	const { data: conv, isPending, error } = useConversation(chatId);
	const { data: rels } = useRelationships();

	if (isPending) {
		return <ConversationChatSkeleton />;
	}
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center gap-1 w-full h-full">
				<h1 className="font-bold text-6xl text-text2">404</h1>
				<h2 className="font-bold text-3xl text-text2">No such conversation</h2>
				<p className="text-text2">You may have left it, or it never existed.</p>
			</div>
		);
	}

	return (
		<div className="relative flex flex-col w-full h-full">
			<ChatHeader conv={conv} />
			<ChannelChat
				key={conv.id}
				channel={conv}
				placeholder={`Message ${conversationTitle(conv, rels)}...`}
			/>
		</div>
	);
}
