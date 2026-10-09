import {
	type ComponentProps,
	type JSX,
	type ReactNode,
	useEffect,
	useState,
} from "react";

import type { ValidationErrors } from "../../api/problem_detail";

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
	className,
	children,
	grayed,
	value,
	onChange,
	...rest
}: InputProps): JSX.Element {
	const [internalValue, setInternalValue] = useState(value ?? "");
	const isError = Boolean(errors?.[name] ?? false);

	useEffect(() => {
		// eslint-disable-next-line @eslint-react/set-state-in-effect
		setInternalValue(value ?? "");
	}, [value]);

	return (
		<div
			className={`relative flex flex-wrap items-center w-full border rounded-md
				px-2 py-1 font-main ${(grayed ?? false) ? "bg-muted/20 text-text2" : "bg-surface text-text"}  
				${isError ? "border-error" : "border-border2 focus-within:border-accent"} ${className}`}
		>
			<input
				className={`bg-transparent outline-0 ring-0 border-0 p-0 w-10 grow peer`}
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
