import { type ComponentProps, type JSX, type ReactNode, useState } from "react";

import type { ValidationErrors } from "@/api/problem_detail";

import { Field } from "./Field";

export type SlideboxProps = Omit<ComponentProps<"input">, "type"> & {
	name: string;
	className?: string;
	children?: ReactNode;
	errors?: ValidationErrors;
	grayed?: boolean;
};

export function Slidebox({
	name,
	errors,
	className,
	children,
	grayed,
	checked,
	onChange,
	...rest
}: SlideboxProps): JSX.Element {
	const [internalChecked, setInternalChecked] = useState(checked ?? false);
	const isError = Boolean(errors?.[name] ?? false);
	const isGrayed = grayed ?? false;

	return (
		<Field
			name={name}
			required={rest.required}
			errors={errors}
			className="items-start"
		>
			<label
				className={`flex flex-row items-center gap-3 font-main ${isGrayed ? "cursor-not-allowed" : "cursor-pointer"} ${className ?? ""}`}
			>
				<input
					className="peer sr-only"
					name={name}
					type="checkbox"
					role="switch"
					disabled={isGrayed}
					checked={internalChecked}
					{...rest}
					onChange={(ev) => {
						setInternalChecked(ev.target.checked);
						onChange?.(ev);
					}}
				/>
				<div
					className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200
                        after:absolute after:top-0.5 after:left-0.5 after:h-4.5 after:w-4.5 after:rounded-full
                        after:shadow-sm after:transition-transform after:duration-200 after:content-['']
                        peer-checked:after:translate-x-5
                        ${isGrayed ? "bg-muted/20 after:bg-muted" : "bg-surface2 after:bg-muted peer-checked:bg-accent peer-checked:after:bg-accent-text hover:bg-accent-soft peer-checked:hover:bg-accent"}
                        ${isError ? "border-error" : "border-border2 peer-focus-visible:border-accent peer-checked:border-accent"}`}
				/>
				{children}
			</label>
		</Field>
	);
}
