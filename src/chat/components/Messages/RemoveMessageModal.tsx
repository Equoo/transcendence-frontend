import { useQueryClient } from "@tanstack/react-query";
import type { JSX } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";

import ConfirmModal from "@/components/Modal/ConfirmModal";
import { toastError } from "@/utils/error.util";

import { deleteMessage, type Message } from "../../api/chat.api";
import { removeMessage } from "../../cache/chat.cache";
import MessageRow from "./MessageRow";

function RemoveMessageModal({
	channelId,
	message,
	onClose,
}: {
	channelId: string;
	message: Message;
	onClose: () => void;
}): JSX.Element {
	const qc = useQueryClient();
	// eslint-disable-next-line id-length
	const { t } = useTranslation();

	return (
		<ConfirmModal
			title={t("chat.removeMessage")}
			description={t("chat.removeMessageConfirm")}
			confirmLabel={t("common.delete")}
			danger
			onClose={onClose}
			onConfirm={() => {
				deleteMessage(channelId, message.id)
					.then(() => {
						removeMessage(qc, channelId, message.id);
					})
					.catch(toastError);
				onClose();
			}}
		>
			<div className="max-h-48 overflow-y-auto rounded-2xl border border-border bg-surface2">
				<MessageRow
					message={message}
					showHeader
					className="mt-0! px-3 py-2.5 hover:bg-transparent"
				/>
			</div>
		</ConfirmModal>
	);
}

export default RemoveMessageModal;
