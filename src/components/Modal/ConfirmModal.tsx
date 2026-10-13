import type { JSX, ReactNode } from "react";
import { createPortal } from "react-dom";

import CheckButton from "../Button/CheckButton";
import Modal from "./Modal";

/** Yes/no confirmation that runs a callback instead of submitting a fetcher form. */
export default function ConfirmModal({
	title,
	children,
	confirmLabel = "Confirm",
	danger = false,
	pending = false,
	onConfirm,
	onClose,
}: {
	title: string;
	children?: ReactNode;
	confirmLabel?: string;
	danger?: boolean;
	pending?: boolean;
	onConfirm: () => void;
	onClose: () => void;
}): JSX.Element {
	return createPortal(
		<Modal title={title} onClose={onClose}>
			{children && (
				<p className="text-muted font-main font-light text-sm text-center w-full">
					{children}
				</p>
			)}
			<div className="flex gap-5 w-full mb-2">
				<CheckButton className="flex-1" onClick={onClose}>
					Cancel
				</CheckButton>
				<CheckButton
					className="flex-1"
					active
					activeCheck={false}
					danger={danger}
					pending={pending}
					onClick={onConfirm}
				>
					{confirmLabel}
				</CheckButton>
			</div>
		</Modal>,
		document.body,
	);
}
