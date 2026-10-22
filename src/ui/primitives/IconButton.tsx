import type { ComponentProps, JSX, ReactNode } from "react";
import type { IconType } from "react-icons";

import { cn } from "../lib/cn";
import { Tooltip } from "../overlay/Tooltip";
import type { ButtonSize } from "./Button";
import { Spinner } from "./Spinner";

export type IconButtonVariant =
	| "ghost"
	| "secondary"
	| "primary"
	| "soft"
	| "danger";

const VARIANTS: Record<IconButtonVariant, string> = {
	ghost: "text-text2 hover:bg-hover hover:text-text active:bg-border active:text-text",
	secondary: "bg-surface text-text border border-border hover:bg-hover active:bg-border",
	primary: "bg-accent text-accent-text shadow-ui-sm hover:brightness-105 active:brightness-90",
	soft: "bg-accent-soft text-accent hover:brightness-[.97] active:brightness-90",
	danger: "text-error hover:bg-error-soft active:bg-error-soft",
};

const SIZES: Record<ButtonSize, string> = {
	sm: "size-ctl-sm rounded-ui-xs",
	md: "size-ctl-md rounded-ui-sm",
	lg: "size-ctl-lg rounded-ui-sm",
};

const ICON: Record<ButtonSize, number> = { sm: 16, md: 18, lg: 20 };

type Props = Omit<ComponentProps<"button">, "children"> & {
	icon: IconType;
	/** Accessible name, also shown as tooltip */
	label: string;
	variant?: IconButtonVariant;
	size?: ButtonSize;
	/** Toggle state: renders aria-pressed and the active look */
	pressed?: boolean;
	loading?: boolean;
	tooltip?: boolean;
	tooltipSide?: "top" | "right";
	/** Small dot or count in the corner */
	badge?: ReactNode;
};

export function IconButton({
	icon: Icon,
	label,
	variant = "ghost",
	size = "md",
	pressed,
	loading = false,
	tooltip = true,
	tooltipSide = "top",
	badge,
	type = "button",
	disabled,
	className,
	...rest
}: Props): JSX.Element {
	const button = (
		<button
			type={type}
			aria-label={label}
			aria-pressed={pressed}
			{...(loading && { "aria-busy": true })}
			disabled={disabled === true || loading}
			className={cn(
				"tap relative inline-grid shrink-0 place-items-center cursor-pointer transition-[scale,background-color,color,filter] duration-150 active:scale-90",
				"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
				"disabled:cursor-not-allowed disabled:opacity-50",
				VARIANTS[variant],
				pressed === true && "bg-accent-soft text-accent hover:bg-accent-soft hover:text-accent",
				SIZES[size],
				className,
			)}
			{...rest}
		>
			{loading ? (
				<Spinner size={ICON[size]} label="" />
			) : (
				<Icon size={ICON[size]} aria-hidden />
			)}
			{Boolean(badge) && (
				<span className="absolute -top-0.5 -right-0.5 pointer-events-none">
					{badge}
				</span>
			)}
		</button>
	);

	if (!tooltip) {
		return button;
	}
	return (
		<Tooltip content={label} side={tooltipSide}>
			{button}
		</Tooltip>
	);
}
