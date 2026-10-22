import {
	createContext,
	type JSX,
	type ReactNode,
	use,
	useId,
	useMemo,
} from "react";

import { cn } from "../lib/cn";

interface FieldContextValue {
	id: string;
	describedBy?: string;
	invalid: boolean;
	required: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);
FieldContext.displayName = "FieldContext";

/** Wiring for a control inside <Field>: id, aria-describedby, aria-invalid */
export function useFieldControl(props: {
	id?: string;
	invalid?: boolean;
	required?: boolean;
}): {
	id?: string;
	"aria-describedby"?: string;
	"aria-invalid"?: boolean;
	required?: boolean;
} {
	const field = use(FieldContext);
	const invalid = props.invalid ?? field?.invalid ?? false;
	return {
		...((props.id ?? field?.id) && { id: props.id ?? field?.id }),
		...(field?.describedBy && { "aria-describedby": field.describedBy }),
		...(invalid && { "aria-invalid": true }),
		...((props.required ?? field?.required) && { required: true }),
	};
}

export type ControlSize = "sm" | "md" | "lg";

const CONTROL_SIZES: Record<ControlSize, string> = {
	sm: "min-h-ctl-sm px-2.5",
	md: "min-h-ctl-md px-3",
	lg: "min-h-ctl-lg px-3.5",
};

/**
 * Box look shared by inputs, selects and textareas. Text is 16px on
 * touch screens so iOS does not zoom on focus.
 */
export function controlClass({
	size = "md",
	invalid = false,
	pill = false,
	className,
}: {
	size?: ControlSize;
	invalid?: boolean;
	pill?: boolean;
	className?: string;
} = {}): string {
	return cn(
		"tap flex w-full items-center gap-2 border bg-surface2 font-main text-base text-text pointer-fine:text-ui-base transition-colors duration-150",
		"placeholder:text-muted has-[:disabled]:bg-hover has-[:disabled]:text-text2 disabled:bg-hover disabled:text-text2",
		"focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/12 outline-none",
		invalid ? "border-error" : "border-border hover:border-border2",
		pill ? "rounded-full" : "rounded-ui-sm",
		CONTROL_SIZES[size],
		className,
	);
}

export function FieldErrors({
	id,
	errors,
}: {
	id?: string;
	errors?: string[];
}): JSX.Element | null {
	if (!errors || errors.length === 0) {
		return null;
	}
	return (
		<div id={id} className="flex flex-col animate-pop">
			{errors.map((err) => (
				<p key={err} className="text-ui-xs tracking-wide text-error">
					{err}
				</p>
			))}
		</div>
	);
}

/** Label + control + hint / errors, with accessibility wired automatically */
export function Field({
	label,
	hint,
	errors,
	required = false,
	optionalLabel,
	inline = false,
	className,
	children,
}: {
	label: ReactNode;
	hint?: ReactNode;
	errors?: string[];
	required?: boolean;
	/** Shown next to the label for optional fields, e.g. "optional" */
	optionalLabel?: string;
	/** Label and control on one row (switches, checkboxes) */
	inline?: boolean;
	className?: string;
	children: ReactNode;
}): JSX.Element {
	const id = useId();
	const hintId = `${id}-hint`;
	const errorId = `${id}-errors`;
	const invalid = Boolean(errors?.length);
	const describedBy =
		[invalid && errorId, Boolean(hint) && hintId].filter(Boolean).join(" ") ||
		null;

	const ctx = useMemo(
		() => ({
			id,
			invalid,
			required,
			...(describedBy !== null && { describedBy }),
		}),
		[id, invalid, required, describedBy],
	);

	return (
		<FieldContext value={ctx}>
			<div
				className={cn(
					"flex gap-1.5",
					inline ? "flex-row items-center justify-between gap-4" : "flex-col",
					className,
				)}
			>
				<div className="flex min-w-0 flex-col gap-0.5">
					<label
						htmlFor={id}
						className="font-main text-ui-sm font-semibold text-text"
					>
						{label}
						{required && (
							<span aria-hidden className="ml-0.5 text-accent">
								*
							</span>
						)}
						{!required && Boolean(optionalLabel) && (
							<span className="ml-1.5 font-normal text-muted">
								{optionalLabel}
							</span>
						)}
					</label>
					{inline && Boolean(hint) && (
						<p id={hintId} className="text-ui-xs text-text2">
							{hint}
						</p>
					)}
				</div>
				{children}
				{!inline && Boolean(hint) && (
					<p id={hintId} className="text-ui-xs text-text2">
						{hint}
					</p>
				)}
				<FieldErrors id={errorId} errors={errors} />
			</div>
		</FieldContext>
	);
}
