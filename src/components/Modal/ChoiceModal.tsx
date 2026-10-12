import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import type { FetcherWithComponents, HTMLFormMethod } from "react-router";

import type { APIError } from "@/api/problem_detail";
import type { EventData } from "@/events/api/events.api";

import CheckButton from "../Button/CheckButton";
import HiddenValues from "../Input/HiddenValues";
import Modal from "./Modal";

export default function ChoiceModal({
	title,
	onClose,
	desc,
	action,
	method,
	id,
	fetcher,
}: {
	title: string;
	onClose: () => void;
	desc?: string;
	action: string;
	method: HTMLFormMethod;
	id?: string;
	fetcher: FetcherWithComponents<EventData | Response | APIError | undefined>;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
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
