import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import type { HTMLFormMethod } from "react-router";

import { useModalFetcher } from "@/hooks/useModalFetcher";

import CheckButton from "../Button/CheckButton";
import HiddenValues from "../Input/HiddenValues";
import { Input } from "../Input/Input";
import Modal, { ModalFooter } from "./Modal";

export default function ChangeModal({
	title,
	onClose,
	then,
	desc,
	action,
	method,
	inputName,
	inputLabel,
	placeholder,
	id,
	minInput,
	maxInput,
	password,
	submitLabel,
}: {
	title: string;
	onClose: () => void;
	then?: (data?: unknown) => void;
	desc?: string;
	action: string;
	method: HTMLFormMethod;
	inputName: string;
	inputLabel?: string;
	placeholder?: string;
	id?: string;
	minInput: number;
	maxInput: number;
	password?: boolean;
	submitLabel?: string;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const fetcher = useModalFetcher({ onClose, then });

	return (
		<Modal title={title} subtitle={desc} onClose={onClose}>
			<fetcher.Form action={action} method={method} className="contents">
				{id && <HiddenValues name="id" values={[id]} />}
				<Input
					autoFocus
					password={password}
					maxLength={maxInput}
					minLength={minInput}
					name={inputName}
					label={inputLabel}
					required
					placeholder={placeholder}
				/>
				<ModalFooter>
					<CheckButton
						active
						activeCheck={false}
						type="submit"
						pending={fetcher.state !== "idle"}
					>
						{submitLabel ?? t("common.validate")}
					</CheckButton>
				</ModalFooter>
			</fetcher.Form>
		</Modal>
	);
}
