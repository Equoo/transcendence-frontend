import { type JSX, useState } from "react";
import { createPortal } from "react-dom";
import { PiCheckBold, PiHourglass, PiUserPlus } from "react-icons/pi";

import CheckButton from "@/components/Button/CheckButton";
import { SearchBar } from "@/components/Input/Search";
import Modal from "@/components/Modal/Modal";
import ProfilePic from "@/components/Profile/ProfilePic";
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

	return createPortal(
		<Modal title="Add a friend" onClose={onClose}>
			<div className="flex flex-col gap-5 w-full">
				<p className="text-muted font-main font-light text-sm text-center">
					Search a member of the group by username and send them a friend request.
				</p>
				<SearchBar
					name="search"
					placeholder="Username"
					autoFocus
					value={search}
					onChange={(ev) => { setSearch(ev.target.value); }}
				/>
				<ul className="flex flex-col max-h-80 overflow-y-auto -mx-2 mb-2">
					{isPending && <li className="text-muted text-sm text-center py-4">Loading members...</li>}
					{error && <li className="text-error text-sm text-center py-4">Couldn't load members.</li>}
					{!isPending && !error && results.length === 0 && (
						<li className="text-muted text-sm text-center py-4">No member matches “{search}”.</li>
					)}
					{results.map((user) => (
						<li key={user.id} className="flex items-center gap-3 px-2 py-2 rounded-base hover:bg-hover">
							<ProfilePic user={user} size={1} status />
							<div className="flex flex-col flex-1 min-w-0">
								<span className="text-text text-[14.5px] font-semibold truncate">{user.userName}</span>
								<span className="text-muted text-[12.5px]">{user.role.name}</span>
							</div>
							<UserAction user={user} rel={rels?.find((rl) => rl.user.id === user.id)} />
						</li>
					))}
				</ul>
			</div>
		</Modal>,
		document.body,
	);
}
