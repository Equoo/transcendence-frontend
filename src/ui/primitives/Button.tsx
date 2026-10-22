import type { ComponentProps, JSX } from "react";
import type { IconType } from "react-icons";
import { Link } from "react-router";

import { cn } from "../lib/cn";
import { Spinner } from "./Spinner";

export type ButtonVariant =
	| "primary"
	| "soft"
	| "secondary"
	| "ghost"
	| "danger"
	| "danger-ghost";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
	primary: "bg-accent text-accent-text shadow-ui-sm hover:brightness-105 active:brightness-90",
	soft: "bg-accent-soft text-accent hover:brightness-[.97] active:brightness-90",
	secondary: "bg-surface text-text border border-border hover:bg-hover active:bg-border",
	ghost: "text-text2 hover:bg-hover hover:text-text active:bg-border active:text-text",
	danger: "bg-error text-accent-text shadow-ui-sm hover:brightness-105 active:brightness-90",
	"danger-ghost": "text-error hover:bg-error-soft active:bg-error-soft active:brightness-95",
};

const SIZES: Record<ButtonSize, string> = {
	sm: "h-ctl-sm px-3 gap-1.5 text-ui-sm",
	md: "h-ctl-md px-4 gap-2 text-ui-base",
	lg: "h-ctl-lg px-5.5 gap-2 text-ui-md",
};

export const ICON_SIZE: Record<ButtonSize, number> = { sm: 15, md: 17, lg: 19 };

export interface ButtonStyle {
	variant?: ButtonVariant;
	size?: ButtonSize;
	fullWidth?: boolean;
	className?: string;
}

/** Button look for elements that are not <Button> (links, labels…) */
export function buttonClass({
	variant = "secondary",
	size = "md",
	fullWidth = false,
	className,
}: ButtonStyle = {}): string {
	return cn(
		"tap inline-flex shrink-0 items-center justify-center rounded-full font-main font-semibold whitespace-nowrap select-none cursor-pointer",
		"transition-[scale,background-color,color,filter,box-shadow] duration-150 active:scale-[.97]",
		"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
		"disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 aria-disabled:pointer-events-none aria-disabled:opacity-50",
		VARIANTS[variant],
		SIZES[size],
		fullWidth && "w-full",
		className,
	);
}

type ButtonProps = ComponentProps<"button"> &
	Omit<ButtonStyle, "className"> & {
		leftIcon?: IconType;
		rightIcon?: IconType;
		/** Shows a spinner and blocks clicks */
		loading?: boolean;
	};

export function Button({
	variant,
	size = "md",
	fullWidth,
	leftIcon: LeftIcon,
	rightIcon: RightIcon,
	loading = false,
	type = "button",
	disabled,
	className,
	children,
	...rest
}: ButtonProps): JSX.Element {
	return (
		<button
			type={type}
			disabled={disabled === true || loading}
			{...(loading && { "aria-busy": true })}
			className={buttonClass({ variant, size, fullWidth, className })}
			{...rest}
		>
			{loading ? (
				<Spinner size={ICON_SIZE[size]} label="" />
			) : (
				LeftIcon && <LeftIcon size={ICON_SIZE[size]} aria-hidden />
			)}
			{children}
			{RightIcon && <RightIcon size={ICON_SIZE[size]} aria-hidden />}
		</button>
	);
}

type ButtonLinkProps = ComponentProps<typeof Link> &
	Omit<ButtonStyle, "className"> & {
		leftIcon?: IconType;
		rightIcon?: IconType;
	};

/** A router link that looks like a button */
export function ButtonLink({
	variant,
	size = "md",
	fullWidth,
	leftIcon: LeftIcon,
	rightIcon: RightIcon,
	className,
	children,
	...rest
}: ButtonLinkProps): JSX.Element {
	return (
		<Link
			className={buttonClass({
				variant,
				size,
				fullWidth,
				className: typeof className === "string" ? className : "",
			})}
			{...rest}
		>
			{LeftIcon && <LeftIcon size={ICON_SIZE[size]} aria-hidden />}
			{children}
			{RightIcon && <RightIcon size={ICON_SIZE[size]} aria-hidden />}
		</Link>
	);
}
