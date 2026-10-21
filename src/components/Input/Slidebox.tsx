import { type ComponentProps, type JSX, type ReactNode, useState } from "react";

import type { ValidationErrors } from "@/api/problem_detail";

import { FieldErrors } from "./Field";

export type SlideboxProps = Omit<ComponentProps<"input">, "type"> & {
	name: string;
	label?: string;
	hint?: ReactNode;
	className?: string;
	errors?: ValidationErrors;
	grayed?: boolean;
};

export function Slidebox({
	name,
	label,
	hint,
	errors,
	className = "",
	grayed = false,
	checked,
	onChange,
	...rest
}: SlideboxProps): JSX.Element {
	const [internalChecked, setInternalChecked] = useState(checked ?? false);
	const isError = Boolean(errors?.[name]);

	return (
		<div className="flex flex-col gap-1 w-full">
			<label
				className={`flex items-center gap-3 ${grayed ? "cursor-not-allowed" : "cursor-pointer"} ${className}`}
			>
				<input
					className="peer sr-only"
					name={name}
					type="checkbox"
					role="switch"
					disabled={grayed}
					checked={internalChecked}
					{...rest}
					onChange={(ev) => {
						setInternalChecked(ev.target.checked);
						onChange?.(ev);
					}}
				/>
				<span
					aria-hidden="true"
					className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200
						after:absolute after:top-0.5 after:left-0.5 after:h-4.5 after:w-4.5 after:rounded-full
						after:shadow-sm after:transition-transform after:duration-200 after:content-['']
						peer-checked:after:translate-x-5 peer-focus-visible:outline-1 peer-focus-visible:outline-accent peer-focus-visible:outline-offset-2
						${grayed ? "bg-hover after:bg-muted" : "bg-surface2 after:bg-muted peer-checked:bg-accent peer-checked:after:bg-accent-text hover:bg-accent-soft peer-checked:hover:bg-accent"}
						${isError ? "border-error" : "border-border2 peer-checked:border-accent"}`}
				/>
				<span className="flex flex-col min-w-0">
					<span className="text-sm font-semibold text-text">
						{label ?? name}
					</span>
					{hint && <span className="text-xs text-muted">{hint}</span>}
				</span>
			</label>
			<FieldErrors errors={errors?.[name]} />
		</div>
	);
}
