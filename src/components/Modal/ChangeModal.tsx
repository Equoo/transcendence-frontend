import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import type { HTMLFormMethod } from "react-router";

import { useModalFetcher } from "@/hooks/useModalFetcher";

import CheckButton from "../Button/CheckButton";
import HiddenValues from "../Input/HiddenValues";
import { Input } from "../Input/Input";
import Modal from "./Modal";

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
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const fetcher = useModalFetcher({ onClose, then });

	return (
		<Modal title={title} onClose={onClose}>
			{desc && (
				<p className="text-muted font-main font-light text-sm text-center w-full">
					{desc}
				</p>
			)}
			<fetcher.Form
				action={action}
				method={method}
				className="flex flex-col items-center gap-5 w-7/10"
			>
				{id && <HiddenValues name="id" values={[id]}></HiddenValues>}
				<Input
					password={password}
					maxLength={maxInput}
					minLength={minInput}
					name={inputName}
					label={inputLabel}
					required
					className="ring-0 focus:border-border border-border rounded-sm"
					placeholder={placeholder}
				></Input>
				<CheckButton
					active
					type="submit"
					pending={fetcher.state !== "idle"}
				>
					{t("common.ok")}
				</CheckButton>
			</fetcher.Form>
		</Modal>
	);
}
