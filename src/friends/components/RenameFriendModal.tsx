import type { JSX } from "react";
import { useTranslation } from "react-i18next";

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
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const rename = useRenameFriend();

	const submit = (nickname: string | null): void => {
		rename.mutate(
			{ userId: rel.user.id, nickname },
			{ onSuccess: onClose },
		);
	};

	return (
		<Modal
			title={t("friends.renameTitle", { name: rel.user.userName })}
			subtitle={t("friends.renameHint", { name: rel.user.userName })}
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
					label={t("friends.nickname")}
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
							{t("friends.reset")}
						</CheckButton>
						<CheckButton type="submit" active activeCheck={false} pending={rename.isPending}>
							{t("common.save")}
						</CheckButton>
					</ModalActions>
				</ModalFooter>
			</form>
		</Modal>
	);
}
