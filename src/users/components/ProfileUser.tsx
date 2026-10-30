import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import {
	PiChatCircleDots,
	PiClockUser,
	PiUserMinus,
	PiUserPlus,
} from "react-icons/pi";

import IconBtn from "@/components/Button/IconBtn";
import ProfileLine from "@/components/Profile/ProfileLine";
import { RelationshipState } from "@/friends/api/relationship.api";
import { useStartConversation } from "@/friends/hooks/useConversations";
import {
	useAddFriend,
	useRelationship,
	useRemoveFriend,
} from "@/friends/hooks/useRelationships";

import type { User } from "../api/users";

export default function ProfileUser({ user }: { user: User }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const add = useAddFriend();
	const rm = useRemoveFriend();
	const rel = useRelationship(user.id);
	const startConv = useStartConversation();

	return (
		<div className="flex justify-between items-center rounded-xl z-500 w-60 max-w-[calc(100vw-5rem)] h-auto p-2 bg-white">
			<ProfileLine status user={user} />

			<div className="flex">
				<IconBtn
					discrete={
						!rel || rel.type === RelationshipState.PendingRequest
					}
					danger={Boolean(rel)}
					icon={
						rel?.type === RelationshipState.PendingRequest
							? PiClockUser
							: rel
								? PiUserMinus
								: PiUserPlus
					}
					tooltip={
						rel?.type === RelationshipState.PendingRequest
							? t("friends.requestSent")
							: rel
								? t("friends.removeFriend")
								: t("friends.addFriend")
					}
					disabled={add.isPending}
					onClick={() => {
						rel?.type === RelationshipState.PendingRequest
							? ""
							: rel
								? rm.mutate(user.id)
								: add.mutate(user.id);
					}}
				/>

				<IconBtn
					discrete
					icon={PiChatCircleDots}
					title={t("friends.message")}
					disabled={startConv.isPending}
					onClick={() => {
						startConv.mutate({ recipients: [user.id] });
					}}
				/>
			</div>
		</div>
	);
}
