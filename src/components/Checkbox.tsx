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
	checked,
	...rest
}: InputProps): JSX.Element {
	const [internalValue, setInternalValue] = useState(checked);
	const isError = Boolean(errors?.[name] ?? false);

	useEffect(() => {
		if (checked) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setInternalValue(checked);
		}
	}, [checked]);

	return (
		<Field name={name} required={rest.required} errors={errors} className="items-start">
			<div className="flex flex-row gap-3">
				<div
					className={`relative border rounded-md max-w-8 max-h-8
                    font-main ${(grayed ?? false) ? "bg-muted/20 text-text2" : "bg-surface text-text hover:bg-accent-soft"}  
                    ${isError ? "border-error" : "border-border2 focus-within:border-accent"} ${className}`}
				>
					{/* <input */}
					{/* 	type="checkbox" */}
					{/* 	className="text-accent cursor-pointer rounded-sm w-6 h-6 text-2xl hover:bg-gray-50 hover:inset-shadow-2xs focus:ring-0" */}
					{/* ></input> */}
					<input
						className={`bg-transparent rounded-md outline-0 ring-0 border-0 p-0 grow peer hover:inset-shadow-2xs min-h-8 min-w-8 w-full h-full cursor-pointer text-accent`}
						name={name}
						type="checkbox"
						disabled={grayed}
						checked={internalValue}
						onChange={(ev) => {
							setInternalValue(ev.target.checked);
						}}
						{...rest}
					/>
				</div>
				{children}
			</div>
		</Field>
	);
}
