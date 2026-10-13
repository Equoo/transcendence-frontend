import type { JSX } from "react";
import { createPortal } from "react-dom";

import CheckButton from "@/components/Button/CheckButton";
import { Input } from "@/components/Input/Input";
import Modal from "@/components/Modal/Modal";

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

	return createPortal(
		<Modal title={`Rename ${rel.user.userName}`} onClose={onClose}>
			<p className="text-muted font-main font-light text-sm text-center w-full">
				Only you can see the nickname you give to {rel.user.userName}.
			</p>
			<form
				className="flex flex-col items-center gap-5 w-full mb-2"
				onSubmit={(ev) => {
					ev.preventDefault();
					const value = (new FormData(ev.currentTarget).get("Nickname") as string).trim();
					submit(value || null);
				}}
			>
				<Input
					name="Nickname"
					maxLength={255}
					placeholder={rel.user.userName}
					value={rel.nickname ?? ""}
					autoFocus
				/>
				<div className="flex gap-5 w-full">
					<CheckButton
						className="flex-1"
						disabled={rel.nickname === null || rename.isPending}
						onClick={() => { submit(null); }}
					>
						Reset
					</CheckButton>
					<CheckButton className="flex-1" type="submit" active pending={rename.isPending}>
						Save
					</CheckButton>
				</div>
			</form>
		</Modal>,
		document.body,
	);
}
