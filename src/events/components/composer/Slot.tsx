import { type JSX, type ReactNode, type RefObject, useRef } from "react";

import { useClickOutside } from "@/hooks/useClickOutside";

export type RequiredField = "name" | "location" | "date" | "size";

export const REQUIRED_FIELDS: RequiredField[] = [
	"name",
	"location",
	"date",
	"size",
];

export const BARE_INPUT =
	"bg-transparent border-0 p-0 shadow-none focus:ring-0 focus:outline-0 focus-visible:outline-0 placeholder:text-muted";

export function slotClass({
	filled,
	next = false,
	active = false,
	error = false,
	nudge = false,
}: {
	filled: boolean;
	next?: boolean;
	active?: boolean;
	error?: boolean;
	nudge?: boolean;
}): string {
	const classes = [
		"transition-colors duration-200",
		"focus-within:bg-accent-soft focus-within:bg-none focus-within:animate-none focus-within:outline-0",
	];

	if (active) {
		classes.push("bg-accent-soft bg-none animate-none");
	} else if (filled) {
		classes.push("hover:bg-hover");
	} else {
		classes.push("slot-skeleton");
		if (next) {
			classes.push(
				"outline-1 outline-dashed outline-accent/60 outline-offset-2",
			);
		}
	}
	if (error) {
		classes.push("ring-1 ring-error");
	}
	if (nudge) {
		classes.push("animate-nudge");
	}
	return classes.join(" ");
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

export function SlotPopover({
	open,
	onClose,
	anchor,
	children,
	placement = "bottom",
	align = "start",
	className = "",
}: {
	open: boolean;
	onClose: () => void;
	anchor: ReactNode;
	children: ReactNode;
	placement?: "top" | "bottom";
	align?: "start" | "end";
	className?: string;
}): JSX.Element {
	const ref = useClickOutside<HTMLDivElement>(useRef(null), () => {
		if (open) {
			onClose();
		}
	});

	return (
		<div
			ref={ref}
			className={`relative ${className}`}
			onKeyDown={(ev) => {
				if (open && ev.key === "Escape") {
					ev.stopPropagation();
					onClose();
				}
			}}
		>
			{anchor}
			{open && (
				<div
					className={`absolute z-20 w-72 max-w-[calc(100vw-3rem)] flex flex-col gap-3 p-3
						bg-surface border border-border rounded-2xl shadow-main animate-pop
						${placement === "top" ? "bottom-full mb-2" : "top-full mt-2"}
						${align === "end" ? "right-0 origin-bottom-right" : "left-0 origin-top-left"}`}
				>
					{children}
				</div>
			)}
		</div>
	);
}

export function TextSlot({
	inputRef,
	value,
	onChange,
	onEnter,
	label,
	placeholder,
	maxLength,
	icon,
	inputClassName = "",
	counterFrom,
	next,
	nudge,
	errors,
	autoFocus = false,
}: {
	inputRef: RefObject<HTMLInputElement | null>;
	value: string;
	onChange: (value: string) => void;
	onEnter: () => void;
	label: string;
	placeholder: string;
	maxLength: number;
	icon?: ReactNode;
	inputClassName?: string;
	counterFrom?: number;
	next: boolean;
	nudge: boolean;
	errors?: string[];
	autoFocus?: boolean;
}): JSX.Element {
	const filled = value.trim() !== "";
	const showCounter =
		typeof counterFrom === "number" && value.length >= counterFrom;

	return (
		<div className="flex flex-col gap-1">
			<label
				className={`relative -mx-2 flex items-center gap-2 rounded-xl px-2 py-1 ${slotClass(
					{ filled, next, nudge, error: Boolean(errors) },
				)}`}
			>
				{icon}
				<input
					ref={inputRef}
					autoFocus={autoFocus}
					value={value}
					maxLength={maxLength}
					placeholder={placeholder}
					aria-label={label}
					className={`${BARE_INPUT} w-full ${inputClassName}`}
					onChange={(ev) => {
						onChange(ev.target.value);
					}}
					onKeyDown={(ev) => {
						if (ev.key === "Enter") {
							ev.preventDefault();
							if (filled) {
								onEnter();
							}
						}
					}}
				/>
				{showCounter && (
					<span className="absolute -bottom-4 right-2 text-[11px] tabular-nums text-muted animate-pop">
						{value.length}/{maxLength}
					</span>
				)}
			</label>
			<FieldErrors errors={errors} />
		</div>
	);
}
