import type { JSX, ReactNode } from "react";

import type { ValidationErrors } from "../../api/problem_detail";

export function fieldBox({
	error = false,
	grayed = false,
}: {
	error?: boolean;
	grayed?: boolean;
} = {}): string {
	return `w-full rounded-xl border px-3 py-1.5 text-sm duration-150 placeholder:text-muted focus:ring-0 focus-visible:outline-0
		${grayed ? "bg-hover text-text2" : "bg-surface2 text-text"}
		${error ? "border-error" : "border-border focus-within:border-accent"}`;
}

export function FieldErrors({
	errors,
}: {
	errors?: string[];
}): JSX.Element | null {
	if (!errors || errors.length === 0) {
		return null;
	}
	return (
		<div className="flex flex-col animate-pop">
			{errors.map((err) => (
				<p key={err} className="text-error text-xs tracking-wide">
					{err}
				</p>
			))}
		</div>
	);
}

export function Field({
	name,
	label,
	htmlFor,
	hint,
	required,
	errors,
	className = "",
	children,
}: {
	name: string;
	label?: string;
	htmlFor?: string;
	hint?: ReactNode;
	required?: boolean;
	errors?: ValidationErrors;
	className?: string;
	children: ReactNode;
}): JSX.Element {
	return (
		<div className={`flex flex-col gap-1 w-full ${className}`}>
			<label
				htmlFor={htmlFor}
				className="text-xs font-semibold text-muted"
			>
				{label ?? name}
				{required && <span className="text-accent"> *</span>}
			</label>
			{children}
			{hint && <p className="text-xs text-muted">{hint}</p>}
			<FieldErrors errors={errors?.[name]} />
		</div>
	);
}
