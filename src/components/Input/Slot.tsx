import {
	type ComponentProps,
	type JSX,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";

import type { ValidationErrors } from "@/api/problem_detail";
import { useClickOutside } from "@/hooks/useClickOutside";

import { FieldErrors } from "./Field";

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
					ev.preventDefault();
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

export type TextSlotProps = ComponentProps<"input"> & {
	name: string;
	label?: string;
	className?: string;
	inputClassName?: string;
	children?: ReactNode;
	errors?: ValidationErrors;
	counterFrom?: number;
	next?: boolean;
	nudge?: boolean;
};

export function TextSlot({
	name,
	label,
	errors,
	className = "",
	inputClassName = "",
	children,
	counterFrom,
	next = false,
	nudge = false,
	value,
	onChange,
	...rest
}: TextSlotProps): JSX.Element {
	const [internalValue, setInternalValue] = useState(value ?? "");
	const text = String(internalValue);
	const fieldErrors = errors?.[name];
	const showCounter =
		typeof counterFrom === "number" &&
		typeof rest.maxLength === "number" &&
		text.length >= counterFrom;

	useEffect(() => {
		// eslint-disable-next-line @eslint-react/set-state-in-effect
		setInternalValue(value ?? "");
	}, [value]);

	return (
		<div className="flex flex-col gap-1">
			<label
				className={`relative -mx-2 flex items-center gap-2 rounded-xl px-2 py-1 ${slotClass(
					{
						filled: text.trim() !== "",
						next,
						nudge,
						error: Boolean(fieldErrors),
					},
				)} ${className}`}
			>
				{children}
				<input
					name={name}
					value={internalValue}
					aria-label={label ?? name}
					{...rest}
					className={`${BARE_INPUT} w-full ${inputClassName}`}
					onChange={(ev) => {
						onChange?.(ev);
						setInternalValue(ev.target.value);
					}}
				/>
				{showCounter && (
					<span className="absolute -bottom-4 right-2 text-[11px] tabular-nums text-muted animate-pop">
						{text.length}/{rest.maxLength}
					</span>
				)}
			</label>
			<FieldErrors errors={fieldErrors} />
		</div>
	);
}
