import type { JSX, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import { PiCheckBold, PiX } from "react-icons/pi";

import { cn } from "../lib/cn";

export type Tone = "neutral" | "accent" | "good" | "warn" | "error";

export const TONES: Record<Tone, string> = {
	neutral: "bg-surface2 text-text2 border-border",
	accent: "bg-accent-soft text-accent border-transparent",
	good: "bg-good-soft text-good border-transparent",
	warn: "bg-warn-soft text-warn border-transparent",
	error: "bg-error-soft text-error border-transparent",
};

const SIZES = {
	sm: "min-h-6 px-2.5 gap-1.5 text-ui-xs",
	md: "min-h-8 px-3 gap-1.5 text-ui-sm",
} as const;

interface ChipProps {
	children: ReactNode;
	tone?: Tone;
	size?: keyof typeof SIZES;
	icon?: IconType;
	/** Colored dot, e.g. event type color */
	dot?: string;
	/** Makes the chip a toggle button */
	onClick?: () => void;
	selected?: boolean;
	/** Adds a remove button */
	onRemove?: () => void;
	disabled?: boolean;
	className?: string;
}

/**
 * Label / filter / toggle pill. Static when no handler, a toggle
 * button with `onClick`, removable with `onRemove`.
 */
export function Chip({
	children,
	tone = "neutral",
	size = "md",
	icon: Icon,
	dot,
	onClick,
	selected,
	onRemove,
	disabled = false,
	className,
}: ChipProps): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const interactive = Boolean(onClick);
	const isOn = selected === true;

	const style = cn(
		"tap inline-flex items-center rounded-full border font-main font-semibold whitespace-nowrap select-none",
		TONES[isOn ? "accent" : tone],
		interactive &&
			"cursor-pointer transition-[background-color,opacity,scale] duration-150 hover:brightness-[.97] active:scale-95 active:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
		interactive && selected === false && "bg-surface",
		disabled && "opacity-50 pointer-events-none",
		SIZES[size],
		// Touch: extend the hit area without growing the chip visually
		interactive && "relative pointer-coarse:after:absolute pointer-coarse:after:-inset-y-2 pointer-coarse:after:inset-x-0",
		className,
	);

	const content = (
		<>
			{isOn && <PiCheckBold size={12} aria-hidden />}
			{!isOn && Icon && <Icon size={14} aria-hidden />}
			{typeof dot !== "undefined" && (
				<span
					className="size-2 shrink-0 rounded-full"
					style={{ background: dot }}
					aria-hidden
				/>
			)}
			{children}
		</>
	);

	if (interactive) {
		return (
			<button
				type="button"
				aria-pressed={selected}
				disabled={disabled}
				onClick={onClick}
				className={style}
			>
				{content}
			</button>
		);
	}

	return (
		<span className={cn(style, Boolean(onRemove) && "pr-1")}>
			{content}
			{onRemove && (
				<button
					type="button"
					aria-label={t("common.remove")}
					onClick={onRemove}
					disabled={disabled}
					className="tap relative grid size-5 place-items-center rounded-full cursor-pointer hover:bg-hover pointer-coarse:after:absolute pointer-coarse:after:-inset-2.5"
				>
					<PiX size={12} aria-hidden />
				</button>
			)}
		</span>
	);
}
