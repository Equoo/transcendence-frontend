import { type ComponentProps, type JSX, type ReactNode, useEffect, useState } from "react";

import type { ValidationErrors } from "@/api/problem_detail";

import { Field } from "./Field";

export type InputProps = ComponentProps<"input"> & {
	name: string;
	className?: string;
	children?: ReactNode;
	errors?: ValidationErrors;
	grayed?: boolean;
};

export function Checkbox({
	name,
	errors,
	className,
	children,
	grayed,
	value,
	...rest
}: InputProps): JSX.Element {
	const [internalValue, setInternalValue] = useState(value);
	const isError = Boolean(errors?.[name] ?? false);

	useEffect(() => {
		if (value) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setInternalValue(value);
		}
	}, [value]);

	return (
		<Field name={name} required={rest.required} errors={errors} className="items-start">
			<div
				className={`relative flex flex-wrap items-center border rounded-md
                    px-2 py-1 font-main ${(grayed ?? false) ? "bg-muted/20 text-text2" : "bg-surface text-text"}  
                    ${isError ? "border-error" : "border-border2 focus-within:border-accent"} ${className}`}
			>
				{children}
				{/* <input */}
				{/* 	type="checkbox" */}
				{/* 	className="text-accent cursor-pointer rounded-sm w-6 h-6 text-2xl hover:bg-gray-50 hover:inset-shadow-2xs focus:ring-0" */}
				{/* ></input> */}
				<input
					className={`bg-transparent outline-0 ring-0 border-0 p-0 w-10 grow peer`}
					name={name}
					type="checkbox"
					disabled={grayed}
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
