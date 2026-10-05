import type { JSX } from "react";
import type { FetcherWithComponents, HTMLFormMethod } from "react-router";

import CheckButton from "../Button/CheckButton";
import HiddenValues from "../Input/HiddenValues";
import { Input } from "../Input/Input";
import Modal from "./Modal";

export default function ChangeModal({
	title,
	onClose,
	desc,
	action,
	method,
	inputName,
	placeholder,
	id,
	minInput,
	maxInput,
	fetcher,
	password,
}: {
	title: string;
	onClose: () => void;
	desc?: string;
	action: string;
	method: HTMLFormMethod;
	inputName: string;
	placeholder?: string;
	id?: string;
	minInput: number;
	maxInput: number;
	fetcher: FetcherWithComponents<Response>;
	password?: boolean;
}): JSX.Element {
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
				{password && (
					<Input
						name="Current password"
						placeholder="current password"
						minLength={minInput}
						maxLength={maxInput}
						required
					></Input>
				)}
				<Input
					maxLength={maxInput}
					minLength={minInput}
					name={inputName}
					required
					className="ring-0 focus:border-border border-border rounded-sm"
					type="text"
					placeholder={placeholder}
				></Input>
				<CheckButton active type="submit">
					OK
				</CheckButton>
			</fetcher.Form>
		</Modal>
	);
}
