import { type JSX, useState } from "react";
import { createPortal } from "react-dom";
import { PiCheckBold } from "react-icons/pi";

import Badge from "@/components/Badge";
import CheckButton from "@/components/Button/CheckButton";
import { Input } from "@/components/Input/Input";
import { SearchBar } from "@/components/Input/Search";
import Modal from "@/components/Modal/Modal";
import ProfilePic from "@/components/Profile/ProfilePic";

import { useStartConversation } from "../hooks/useConversations";
import { useRelationships } from "../hooks/useRelationships";
import { isFriend, matchesSearch, relationName } from "../utils/friends.util";

const MAX_RECIPIENTS = 9;

export default function NewConversationModal({ onClose }: { onClose: () => void }): JSX.Element {
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState<string[]>([]);
	const [name, setName] = useState("");
	const { data: rels, isPending } = useRelationships();
	const start = useStartConversation();

	const friends = (rels ?? []).filter(isFriend)
		.toSorted((lhs, rhs) => relationName(lhs).localeCompare(relationName(rhs)));
	const shown = friends.filter((rel) =>
		matchesSearch(relationName(rel), search) || matchesSearch(rel.user.userName, search));

	const toggle = (userId: string): void => {
		setSelected((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: prev.length < MAX_RECIPIENTS ? [...prev, userId] : prev);
	};

	const isGroup = selected.length > 1;

	return createPortal(
		<Modal title="New conversation" onClose={onClose} width="w-[calc(100%-2rem)]">
			<div className="flex flex-col gap-4 w-full">
				<p className="text-muted font-main font-light text-sm text-center">
					Pick one friend for a direct message, or up to {MAX_RECIPIENTS} for a group.
				</p>
				<SearchBar
					name="search"
					placeholder="Search friends"
					autoFocus
					value={search}
					onChange={(ev) => { setSearch(ev.target.value); }}
				/>
				{selected.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{friends.filter((rel) => selected.includes(rel.user.id)).map((rel) => (
							<Badge key={rel.user.id} bg="bg-accent-soft" border="border border-accent/30" text="text-text">
								{relationName(rel)}
								<button type="button" className="cursor-pointer font-bold" onClick={() => { toggle(rel.user.id); }}>×</button>
							</Badge>
						))}
					</div>
				)}
				<ul className="flex flex-col max-h-72 overflow-y-auto -mx-2">
					{isPending && <li className="text-muted text-sm text-center py-4">Loading friends...</li>}
					{!isPending && friends.length === 0 && (
						<li className="text-muted text-sm text-center py-4">You don't have any friends yet. Add some first!</li>
					)}
					{!isPending && friends.length > 0 && shown.length === 0 && (
						<li className="text-muted text-sm text-center py-4">No friend matches “{search}”.</li>
					)}
					{shown.map((rel) => {
						const checked = selected.includes(rel.user.id);
						return (
							<li key={rel.user.id}>
								<button
									type="button"
									className="flex w-full items-center gap-3 px-2 py-2 rounded-base hover:bg-hover cursor-pointer text-left"
									onClick={() => { toggle(rel.user.id); }}
								>
									<ProfilePic user={rel.user} size={1} status />
									<span className="flex-1 min-w-0 truncate text-text text-[14.5px] font-semibold">
										{relationName(rel)}
									</span>
									<span className={`flex items-center justify-center w-5 h-5 rounded-md border duration-120
										${checked ? "bg-accent border-accent text-accent-text" : "border-border2 bg-surface"}`}>
										{checked && <PiCheckBold size={12} />}
									</span>
								</button>
							</li>
						);
					})}
				</ul>
				{isGroup && (
					<Input
						name="Group name"
						maxLength={25}
						placeholder="Optional"
						value={name}
						onChange={(ev) => { setName(ev.target.value); }}
					/>
				)}
				<CheckButton
					className="mb-2"
					active
					activeCheck={false}
					disabled={selected.length === 0}
					pending={start.isPending}
					onClick={() => {
						start.mutate(
							{ recipients: selected, ...(isGroup && name.trim() ? { name: name.trim() } : {}) },
							{ onSuccess: onClose },
						);
					}}
				>
					{isGroup ? "Create group" : "Start conversation"}
				</CheckButton>
			</div>
		</Modal>,
		document.body,
	);
}
