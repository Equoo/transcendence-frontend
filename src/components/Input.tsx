import {
	type ComponentProps,
	type JSX,
	type ReactNode,
	useEffect,
	useState,
} from "react";
import { TbCopy, TbCopyCheck } from "react-icons/tb";

import type { ValidationErrors } from "../api/problem_detail";
import { Field } from "./Field";

export type InputProps = ComponentProps<"input"> & {
	name: string;
	className?: string;
	children?: ReactNode;
	errors?: ValidationErrors;
	grayed?: boolean;
	copyable?: boolean;
};

function copyContent(content: string): void {
	const clipboard = new ClipboardItem({
		"text/plain": content,
	});

	void navigator.clipboard.write([clipboard]);
}

export function Input({
	name,
	errors,
	className,
	children,
	grayed,
	copyable,
	value,
	...rest
}: InputProps): JSX.Element {
	const [internalValue, setInternalValue] = useState(value ?? "");
	const [copied, setCopied] = useState(false);
	const isError = Boolean(errors?.[name] ?? false);

	useEffect(() => {
		if (value) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect, react-hooks/set-state-in-effect
			setInternalValue(value);
		}
	}, [value]);

	return (
		<Field name={name} required={rest.required} errors={errors}>
			<div
				className={`relative flex flex-wrap items-center w-ful border rounded-md
                    px-2 py-1 font-main ${(grayed ?? false) ? "bg-muted/20 text-text2" : "bg-surface text-text"}  
                    ${isError ? "border-error" : "border-border2 focus-within:border-accent"} ${className}`}
			>
				{(copyable ?? false) &&
					(copied ? (
						<TbCopyCheck size={20} className="mr-1.5" />
					) : (
						<TbCopy
							size={20}
							onClick={() => {
								copyContent(internalValue as string);
								setCopied(true);
							}}
							className="mr-1.5"
						/>
					))}
				{children}
				<input
					className={`bg-transparent outline-0 ring-0 border-0 p-0 w-10 grow peer`}
					name={name}
					value={internalValue}
					onChange={(ev) => {
						setInternalValue(ev.target.value);
					}}
					{...rest}
				/>
			</div>
		</Field>
	);
}
