import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiCheckBold, PiX } from "react-icons/pi";

import Badge from "@/components/Badge";
import CheckButton from "@/components/Button/CheckButton";
import { Input } from "@/components/Input/Input";
import { SearchBar } from "@/components/Input/Search";
import { ModalList, ModalListItem } from "@/components/List/ModalList";
import Modal, { ModalFooter } from "@/components/Modal/Modal";
import UserLine from "@/components/Profile/UserLine";

import { useStartConversation } from "../hooks/useConversations";
import { useRelationships } from "../hooks/useRelationships";
import { isFriend, matchesSearch, relationName } from "../utils/friends.util";

const MAX_RECIPIENTS = 9;

export default function NewConversationModal({ onClose }: { onClose: () => void }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
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

	return (
		<Modal
			size="lg"
			title={t("friends.newConversation")}
			subtitle={t("friends.newConversationHint", { max: MAX_RECIPIENTS })}
			onClose={onClose}
		>
			<SearchBar
				name="search"
				placeholder={t("friends.searchFriends")}
				autoFocus
				value={search}
				onChange={(ev) => { setSearch(ev.target.value); }}
			/>
			{selected.length > 0 && (
				<div className="flex flex-wrap gap-1.5">
					{friends.filter((rel) => selected.includes(rel.user.id)).map((rel) => (
						<Badge key={rel.user.id} bg="bg-accent-soft" border="border border-accent/30" text="text-text" className="animate-pop">
							{relationName(rel)}
							<button
								type="button"
								aria-label={t("common.remove")}
								className="-mr-0.5 rounded-full text-muted hover:text-text cursor-pointer"
								onClick={() => { toggle(rel.user.id); }}
							>
								<PiX size={11} />
							</button>
						</Badge>
					))}
				</div>
			)}
			<ModalList
				className="max-h-72"
				message={
					isPending ? t("friends.loadingFriends")
						: friends.length === 0 ? t("friends.noFriendsYet")
							: shown.length === 0 && t("friends.noFriendMatches", { search })
				}
			>
				{shown.map((rel) => {
					const checked = selected.includes(rel.user.id);
					return (
						<ModalListItem key={rel.user.id} selected={checked} onClick={() => { toggle(rel.user.id); }}>
							<UserLine user={rel.user} name={relationName(rel)} />
							<span className={`flex items-center justify-center size-5 shrink-0 rounded-md border duration-150
								${checked ? "bg-accent border-accent text-accent-text" : "border-border2 bg-surface"}`}>
								{checked && <PiCheckBold size={12} className="animate-pop" />}
							</span>
						</ModalListItem>
					);
				})}
			</ModalList>
			<ModalFooter>
				{isGroup && (
					<Input
						name="Group name"
						maxLength={25}
						placeholder={t("friends.optional")}
						value={name}
						onChange={(ev) => { setName(ev.target.value); }}
					/>
				)}
				<CheckButton
					active={selected.length > 0}
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
					{isGroup ? t("friends.createGroup") : t("friends.startConversation")}
				</CheckButton>
			</ModalFooter>
		</Modal>
	);
}
