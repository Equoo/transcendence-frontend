import type { JSX } from "react";
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
	const add = useAddFriend();
	const rm = useRemoveFriend();
	const rel = useRelationship(user.id);
	const startConv = useStartConversation();

	return (
		<div className="flex justify-between items-center rounded-xl z-500 w-60  h-auto p-2 bg-white">
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
							? "Friend request sent"
							: rel
								? "Remove friend"
								: "Add friend"
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
					title="Message"
					disabled={startConv.isPending}
					onClick={() => {
						startConv.mutate({ recipients: [user.id] });
					}}
				/>
			</div>
		</div>
	);
}
