import type { JSX } from "react";
import type { HTMLFormMethod } from "react-router";

import { useModalFetcher } from "@/hooks/useModalFetcher";

import ConfirmModal from "./ConfirmModal";

export default function ChoiceModal({
	title,
	onClose,
	then,
	desc,
	action,
	method,
	id,
	confirmLabel,
	danger = true,
}: {
	title: string;
	onClose: () => void;
	then?: (data?: unknown) => void;
	desc?: string;
	action: string;
	method: HTMLFormMethod;
	id?: string;
	confirmLabel?: string;
	danger?: boolean;
}): JSX.Element {
	const fetcher = useModalFetcher({ onClose, then });

	return (
		<ConfirmModal
			title={title}
			description={desc}
			confirmLabel={confirmLabel}
			danger={danger}
			pending={fetcher.state !== "idle"}
			onClose={onClose}
			onConfirm={() => {
				void fetcher.submit(id ? { id } : {}, { action, method });
			}}
		/>
	);
}
