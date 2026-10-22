import type { JSX, ReactNode } from "react";

import { cn } from "../lib/cn";
import { type Tone, TONES } from "./Chip";

const SOLID: Record<Tone, string> = {
	neutral: "bg-muted text-surface",
	accent: "bg-accent text-accent-text",
	good: "bg-good text-accent-text",
	warn: "bg-warn text-accent-text",
	error: "bg-error text-accent-text",
};

/** Compact status label: "RAG", "Admin", "New"… */
export function Badge({
	children,
	tone = "neutral",
	solid = false,
	className,
}: {
	children: ReactNode;
	tone?: Tone;
	solid?: boolean;
	className?: string;
}): JSX.Element {
	return (
		<span
			className={cn(
				"inline-flex h-5 items-center gap-1 rounded-ui-xs border px-1.5 font-main text-ui-2xs font-bold uppercase tracking-wider whitespace-nowrap",
				solid ? cn(SOLID[tone], "border-transparent") : TONES[tone],
				className,
			)}
		>
			{children}
		</span>
	);
}

/** Unread counter. Renders nothing at 0. */
export function CountBadge({
	count,
	max = 99,
	tone = "accent",
	label,
	className,
}: {
	count: number;
	max?: number;
	tone?: Tone;
	/** Accessible text, e.g. "3 unread messages" */
	label?: string;
	className?: string;
}): JSX.Element | null {
	if (count <= 0) {
		return null;
	}
	return (
		<span
			aria-label={label}
			className={cn(
				"inline-grid h-5 min-w-5 place-items-center rounded-full px-1.5 font-main text-ui-2xs font-bold tabular-nums",
				SOLID[tone],
				className,
			)}
		>
			{count > max ? `${max}+` : count}
		</span>
	);
}

/** Small presence / notification dot */
export function Dot({
	tone = "accent",
	className,
}: {
	tone?: Tone;
	className?: string;
}): JSX.Element {
	return (
		<span
			aria-hidden
			className={cn(
				"block size-2.5 rounded-full ring-2 ring-surface",
				SOLID[tone],
				className,
			)}
		/>
	);
}
