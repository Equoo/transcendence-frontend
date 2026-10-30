import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
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
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [other] = conv.recipients;
	const rel = useRelationship(other.id);
	const add = useAddFriend();

	if (!rel || rel.type === RelationshipState.PendingResponse) {
		return (
			<IconBtn
				discrete
				icon={PiUserPlus}
				title={rel ? t("friends.acceptRequest") : t("friends.addFriend")}
				disabled={add.isPending}
				onClick={() => { add.mutate(other.id); }}
			/>
		);
	}
	if (rel.type === RelationshipState.PendingRequest) {
		return <IconBtn discrete disabled icon={PiHourglass} title={t("friends.requestSent")} />;
	}
	return null;
}

function GroupActions({ conv, title }: { conv: Conversation; title: string }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const leave = useLeaveConversation();
	const [confirm, setConfirm] = useState(false);

	return (<>
		<IconBtn discrete icon={PiSignOut} title={t("friends.leaveGroup")} onClick={() => { setConfirm(true); }} />
		{confirm && (
			<ConfirmModal
				title={t("friends.leaveGroup")}
				confirmLabel={t("friends.leave")}
				danger
				pending={leave.isPending}
				onClose={() => { setConfirm(false); }}
				onConfirm={() => { leave.mutate(conv.id); }}
				description={<>{t("friends.leaveGroupConfirm", { name: title })}</>}
			/>
		)}
	</>);
}

function ChatHeader({ conv }: { conv: Conversation }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
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
						? t("friends.membersCount", { count: conv.recipients.length + 1 })
						: <ActivityLabel userId={conv.recipients[0].id} />}
				</div>
			</div>
			<span className="flex-1" />
			{group ? <GroupActions conv={conv} title={title} /> : <DirectActions conv={conv} />}
		</div>
	);
}

export default function ConversationChat({ chatId }: { chatId: string }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const { data: conv, isPending, error } = useConversation(chatId);
	const { data: rels } = useRelationships();

	if (isPending) {
		return <ConversationChatSkeleton />;
	}
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center gap-1 w-full h-full">
				<h1 className="font-bold text-6xl text-text2">404</h1>
				<h2 className="font-bold text-3xl text-text2">{t("friends.conversationNotFound")}</h2>
				<p className="text-text2">{t("friends.conversationNotFoundHint")}</p>
			</div>
		);
	}

	return (
		<div className="relative flex flex-col w-full h-full">
			<ChatHeader conv={conv} />
			<ChannelChat
				key={conv.id}
				channel={conv}
				placeholder={t("friends.messageTo", { name: conversationTitle(conv, rels) })}
			/>
		</div>
	);
}
