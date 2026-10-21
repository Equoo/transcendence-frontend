import type { JSX, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import CheckButton from "../Button/CheckButton";
import Modal, { ModalActions, ModalFooter } from "./Modal";

export default function ConfirmModal({
	title,
	description,
	children,
	confirmLabel,
	danger = false,
	pending = false,
	onConfirm,
	onClose,
}: {
	title: string;
	description?: ReactNode;
	children?: ReactNode;
	confirmLabel?: string;
	danger?: boolean;
	pending?: boolean;
	onConfirm: () => void;
	onClose: () => void;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();

	return (
		<Modal size="sm" title={title} subtitle={description} onClose={onClose}>
			{children}
			<ModalFooter>
				<ModalActions>
					<CheckButton discrete onClick={onClose}>
						{t("common.cancel")}
					</CheckButton>
					<CheckButton
						active
						activeCheck={false}
						danger={danger}
						pending={pending}
						onClick={onConfirm}
					>
						{confirmLabel ?? t("common.confirm")}
					</CheckButton>
				</ModalActions>
			</ModalFooter>
		</Modal>
	);
}
