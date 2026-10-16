import { type JSX, useState } from "react";
import {
	PiChatCircleDots,
	PiCheckBold,
	PiDotsThreeVerticalBold,
	PiProhibit,
	PiUserMinus,
	PiXBold,
} from "react-icons/pi";
import { TbPencil } from "react-icons/tb";

import CheckButton from "@/components/Button/CheckButton";
import IconBtn from "@/components/Button/IconBtn";
import PopupList from "@/components/List/PopupList";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import ProfilePic from "@/components/Profile/ProfilePic";

import { type Relationship, RelationshipState } from "../api/relationship.api";
import { useStartConversation } from "../hooks/useConversations";
import { useAddFriend, useBlockUser, useRemoveFriend } from "../hooks/useRelationships";
import { relationName } from "../utils/friends.util";
import ActivityLabel from "./ActivityLabel";
import RenameFriendModal from "./RenameFriendModal";

function Subtitle({ rel }: { rel: Relationship }): JSX.Element {
	switch (rel.type) {
		case RelationshipState.PendingRequest:
			return <>Outgoing friend request</>;
		case RelationshipState.PendingResponse:
			return <>Incoming friend request</>;
		case RelationshipState.Blocked:
			return <>Blocked</>;
		case RelationshipState.Friend:
		default:
			return <ActivityLabel userId={rel.user.id} />;
	}
}

type Confirm = "remove" | "block" | null;

function FriendActions({ rel }: { rel: Relationship }): JSX.Element {
	const userId = rel.user.id;
	const add = useAddFriend();
	const remove = useRemoveFriend();
	const block = useBlockUser();
	const startConv = useStartConversation();

	const [showMenu, setShowMenu] = useState(false);
	const [showRename, setShowRename] = useState(false);
	const [confirm, setConfirm] = useState<Confirm>(null);

	if (rel.type === RelationshipState.PendingResponse) {
		return (<>
			<IconBtn
				active
				icon={PiCheckBold}
				title="Accept"
				disabled={add.isPending}
				onClick={() => { add.mutate(userId); }}
			/>
			<IconBtn
				icon={PiXBold}
				title="Decline"
				disabled={remove.isPending}
				onClick={() => { remove.mutate(userId); }}
			/>
		</>);
	}
	if (rel.type === RelationshipState.PendingRequest) {
		return (
			<IconBtn
				icon={PiXBold}
				title="Cancel request"
				disabled={remove.isPending}
				onClick={() => { remove.mutate(userId); }}
			/>
		);
	}
	if (rel.type === RelationshipState.Blocked) {
		return (
			<CheckButton
				pending={remove.isPending}
				onClick={() => { remove.mutate(userId); }}
			>
				Unblock
			</CheckButton>
		);
	}

	return (<>
		<IconBtn
			icon={PiChatCircleDots}
			title="Message"
			disabled={startConv.isPending}
			onClick={() => { startConv.mutate({ recipients: [userId] }); }}
		/>
		<div className="relative">
			<IconBtn
				icon={PiDotsThreeVerticalBold}
				title="More"
				onClick={() => { setShowMenu(true); }}
			/>
			{showMenu && (
				<PopupList
					className="right-0 top-full mt-1 z-30 w-44 shadow-main border border-border"
					onClose={() => { setShowMenu(false); }}
					rows={[
						{
							id: "rename",
							onClick: (): void => { setShowMenu(false); setShowRename(true); },
							content: <span className="inline-flex items-center gap-2.5"><TbPencil />Rename</span>,
						},
						{
							id: "remove",
							onClick: (): void => { setShowMenu(false); setConfirm("remove"); },
							content: <span className="inline-flex items-center gap-2.5 text-error"><PiUserMinus />Remove friend</span>,
						},
						{
							id: "block",
							onClick: (): void => { setShowMenu(false); setConfirm("block"); },
							content: <span className="inline-flex items-center gap-2.5 text-error"><PiProhibit />Block</span>,
						},
					]}
				/>
			)}
		</div>

		{showRename && (
			<RenameFriendModal rel={rel} onClose={() => { setShowRename(false); }} />
		)}
		{confirm === "remove" && (
			<ConfirmModal
				title="Remove friend"
				confirmLabel="Remove"
				danger
				pending={remove.isPending}
				onClose={() => { setConfirm(null); }}
				onConfirm={() => { remove.mutate(userId, { onSuccess: () => { setConfirm(null); } }); }}
			>
				Remove {relationName(rel)} from your friends?
			</ConfirmModal>
		)}
		{confirm === "block" && (
			<ConfirmModal
				title="Block user"
				confirmLabel="Block"
				danger
				pending={block.isPending}
				onClose={() => { setConfirm(null); }}
				onConfirm={() => { block.mutate(userId, { onSuccess: () => { setConfirm(null); } }); }}
			>
				{relationName(rel)} won't be able to send you friend requests or start conversations with you.
			</ConfirmModal>
		)}
	</>);
}

export default function FriendRow({ rel }: { rel: Relationship }): JSX.Element {
	return (
		<li className="flex items-center gap-3 px-3 py-2.5 rounded-base border-t border-border first:border-t-0 hover:bg-hover duration-120">
			<ProfilePic user={rel.user} size={1} status={rel.type === RelationshipState.Friend} />
			<div className="flex flex-col min-w-0 flex-1">
				<p className="text-text text-[14.5px] font-semibold truncate">
					{relationName(rel)}
					{rel.nickname && (
						<span className="ml-2 text-muted font-normal text-[13px]">{rel.user.userName}</span>
					)}
				</p>
				<p className="text-muted text-[12.5px]">
					<Subtitle rel={rel} />
				</p>
			</div>
			<div className="flex items-center gap-2">
				<FriendActions rel={rel} />
			</div>
		</li>
	);
}
