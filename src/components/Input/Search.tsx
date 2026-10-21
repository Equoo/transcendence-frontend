import {
	type ComponentProps,
	type JSX,
	type ReactNode,
	useEffect,
	useState,
} from "react";

import type { ValidationErrors } from "../../api/problem_detail";
import { fieldBox } from "./Field";
import { BARE_INPUT } from "./Slot";

export type InputProps = ComponentProps<"input"> & {
	name: string;
	className?: string;
	children?: ReactNode;
	errors?: ValidationErrors;
	grayed?: boolean;
	copyable?: boolean;
};

export function SearchBar({
	name,
	errors,
	className = "",
	children,
	grayed,
	value,
	onChange,
	...rest
}: InputProps): JSX.Element {
	const [internalValue, setInternalValue] = useState(value ?? "");

	useEffect(() => {
		// eslint-disable-next-line @eslint-react/set-state-in-effect
		setInternalValue(value ?? "");
	}, [value]);

	return (
		<div
			className={`relative flex items-center gap-2 ${fieldBox({
				error: Boolean(errors?.[name]),
				grayed,
			})} ${className}`}
		>
			{children}
			<input
				className={`${BARE_INPUT} min-w-0 grow h-6 text-sm`}
				name={name}
				value={internalValue}
				{...rest}
				onChange={(ev) => {
					if (onChange) {
						onChange(ev);
					}
					setInternalValue(ev.target.value);
				}}
			/>
		</div>
	);
}
