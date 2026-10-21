import { type JSX, useState } from "react";
import { PiCheckBold, PiHourglass, PiUserPlus } from "react-icons/pi";

import CheckButton from "@/components/Button/CheckButton";
import { SearchBar } from "@/components/Input/Search";
import { ModalList, ModalListItem } from "@/components/List/ModalList";
import Modal from "@/components/Modal/Modal";
import UserLine from "@/components/Profile/UserLine";
import type { User } from "@/users/api/users";
import { useUser } from "@/users/hooks/users";

import { type Relationship, RelationshipState } from "../api/relationship.api";
import { useAddFriend, useRelationships, useUsers } from "../hooks/useRelationships";
import { matchesSearch } from "../utils/friends.util";

function UserAction({ user, rel }: { user: User; rel?: Relationship }): JSX.Element {
	const add = useAddFriend();

	if (!rel) {
		return (
			<CheckButton active activeCheck={false} pending={add.isPending} onClick={() => { add.mutate(user.id); }}>
				<PiUserPlus />Add
			</CheckButton>
		);
	}

	switch (rel.type) {
		case RelationshipState.Friend:
			return <span className="inline-flex items-center gap-1.5 text-good text-sm font-semibold"><PiCheckBold />Friend</span>;
		case RelationshipState.PendingRequest:
			return <span className="inline-flex items-center gap-1.5 text-muted text-sm font-semibold"><PiHourglass />Pending</span>;
		case RelationshipState.Blocked:
			return <span className="text-muted text-sm font-semibold">Blocked</span>;
		case RelationshipState.PendingResponse:
		default:
			return (
				<CheckButton active pending={add.isPending} onClick={() => { add.mutate(user.id); }}>
					Accept
				</CheckButton>
			);
	}
}

export default function AddFriendModal({ onClose }: { onClose: () => void }): JSX.Element {
	const me = useUser();
	const [search, setSearch] = useState("");
	const { data: users, isPending, error } = useUsers();
	const { data: rels } = useRelationships();

	const results = (users ?? [])
		.filter((us) => us.id !== me?.id && matchesSearch(us.userName, search))
		.toSorted((lhs, rhs) => lhs.userName.localeCompare(rhs.userName));

	return (
		<Modal
			size="lg"
			title="Add a friend"
			subtitle="Search a member of the group by username and send them a friend request."
			onClose={onClose}
		>
			<SearchBar
				name="search"
				placeholder="Username"
				autoFocus
				value={search}
				onChange={(ev) => { setSearch(ev.target.value); }}
			/>
			<ModalList
				message={
					isPending ? "Loading members..."
						: error ? <span className="text-error">Couldn't load members.</span>
							: results.length === 0 && `No member matches “${search}”.`
				}
			>
				{results.map((user) => (
					<ModalListItem key={user.id}>
						<UserLine user={user} subtitle={user.role.name} />
						<UserAction user={user} rel={rels?.find((rl) => rl.user.id === user.id)} />
					</ModalListItem>
				))}
			</ModalList>
		</Modal>
	);
}
