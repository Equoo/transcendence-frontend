import { type JSX, type KeyboardEvent, useRef } from "react";
import type { IconType } from "react-icons";

import { cn } from "../lib/cn";

export interface SegmentedOption<T extends string> {
	value: T;
	label: string;
	icon?: IconType;
}

/** Segmented control (Month / Week / List). Arrow keys move the selection. */
export function Segmented<T extends string>({
	options,
	value,
	onChange,
	label,
	size = "md",
	fullWidth = false,
	iconOnlyOnPhone = false,
	className,
}: {
	options: SegmentedOption<T>[];
	value: T;
	onChange: (value: T) => void;
	label: string;
	size?: "sm" | "md";
	fullWidth?: boolean;
	/** Hide labels below md when every option has an icon */
	iconOnlyOnPhone?: boolean;
	className?: string;
}): JSX.Element {
	const groupRef = useRef<HTMLDivElement>(null);

	function onKeyDown(ev: KeyboardEvent): void {
		const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[
			ev.key
		];
		if (typeof step === "undefined") {
			return;
		}
		ev.preventDefault();
		const index = options.findIndex((opt) => opt.value === value);
		const next = (index + step + options.length) % options.length;
		onChange(options[next].value);
		const radios = groupRef.current?.querySelectorAll<HTMLButtonElement>("[role=radio]");
		radios?.item(next).focus();
	}

	return (
		<div
			ref={groupRef}
			role="radiogroup"
			aria-label={label}
			onKeyDown={onKeyDown}
			className={cn(
				"inline-flex rounded-full border border-border bg-surface2 p-0.75",
				fullWidth && "flex w-full",
				className,
			)}
		>
			{options.map(({ value: optValue, label: optLabel, icon: Icon }) => {
				const selected = optValue === value;
				return (
					<button
						key={optValue}
						type="button"
						role="radio"
						aria-checked={selected}
						tabIndex={selected ? 0 : -1}
						onClick={() => {
							onChange(optValue);
						}}
						className={cn(
							"tap inline-flex flex-1 items-center justify-center gap-1.5 rounded-full font-main font-semibold whitespace-nowrap cursor-pointer transition-[background-color,color,box-shadow,scale] duration-150 active:scale-95",
							"focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
							size === "sm"
								? "h-[calc(var(--spacing-ctl-sm)-0.375rem)] px-3 text-ui-xs"
								: "h-[calc(var(--spacing-ctl-md)-0.375rem)] px-3.5 text-ui-sm",
							selected
								? "bg-surface text-text shadow-ui-sm"
								: "text-text2 hover:text-text",
						)}
					>
						{Icon && <Icon size={15} aria-hidden />}
						<span className={cn(iconOnlyOnPhone && "max-md:sr-only")}>
							{optLabel}
						</span>
					</button>
				);
			})}
		</div>
	);
}
