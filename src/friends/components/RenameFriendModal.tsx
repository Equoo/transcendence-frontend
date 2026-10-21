import type { JSX } from "react";

import CheckButton from "@/components/Button/CheckButton";
import { Input } from "@/components/Input/Input";
import Modal, { ModalActions, ModalFooter } from "@/components/Modal/Modal";

import type { Relationship } from "../api/relationship.api";
import { useRenameFriend } from "../hooks/useRelationships";

export default function RenameFriendModal({
	rel,
	onClose,
}: {
	rel: Relationship;
	onClose: () => void;
}): JSX.Element {
	const rename = useRenameFriend();

	const submit = (nickname: string | null): void => {
		rename.mutate(
			{ userId: rel.user.id, nickname },
			{ onSuccess: onClose },
		);
	};

	return (
		<Modal
			title={`Rename ${rel.user.userName}`}
			subtitle={`Only you can see the nickname you give to ${rel.user.userName}.`}
			onClose={onClose}
		>
			<form
				className="contents"
				onSubmit={(ev) => {
					ev.preventDefault();
					const value = (new FormData(ev.currentTarget).get("Nickname") as string).trim();
					submit(value || null);
				}}
			>
				<Input
					name="Nickname"
					label="Nickname"
					maxLength={255}
					placeholder={rel.user.userName}
					value={rel.nickname ?? ""}
					autoFocus
				/>
				<ModalFooter>
					<ModalActions>
						<CheckButton
							discrete
							disabled={rel.nickname === null || rename.isPending}
							onClick={() => { submit(null); }}
						>
							Reset
						</CheckButton>
						<CheckButton type="submit" active activeCheck={false} pending={rename.isPending}>
							Save
						</CheckButton>
					</ModalActions>
				</ModalFooter>
			</form>
		</Modal>
	);
}
