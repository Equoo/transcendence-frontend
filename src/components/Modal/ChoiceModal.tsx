import type { JSX } from "react";
import type { FetcherWithComponents, HTMLFormMethod } from "react-router";

import CheckButton from "../CheckButton";
import HiddenValues from "../HiddenValues";
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
	fetcher: FetcherWithComponents<Response>;
}): JSX.Element {
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
						Yes
					</CheckButton>
					<CheckButton active activeCheck={false} onClick={onClose}>
						No
					</CheckButton>
				</div>
			</fetcher.Form>
		</Modal>
	);
}
