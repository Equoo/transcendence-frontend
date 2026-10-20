import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import type { HTMLFormMethod } from "react-router";

import { useModalFetcher } from "@/hooks/useModalFetcher";

import CheckButton from "../Button/CheckButton";
import HiddenValues from "../Input/HiddenValues";
import Modal from "./Modal";

export default function ChoiceModal({
	title,
	onClose,
	then,
	desc,
	action,
	method,
	id,
}: {
	title: string;
	onClose: () => void;
	then?: (data?: unknown) => void;
	desc?: string;
	action: string;
	method: HTMLFormMethod;
	id?: string;
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
				method={method}
				action={action}
				className="inline-flex gap-8"
			>
				{id && <HiddenValues name="id" values={[id]}></HiddenValues>}
				<div className="flex gap-5">
					<CheckButton
						type="submit"
						pending={fetcher.state !== "idle"}
					>
						{t("common.yes")}
					</CheckButton>
					<CheckButton active activeCheck={false} onClick={onClose}>
						{t("common.no")}
					</CheckButton>
				</div>
			</fetcher.Form>
		</Modal>
	);
}
