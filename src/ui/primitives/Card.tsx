import type { ComponentProps, JSX, ReactNode } from "react";

import { cn } from "../lib/cn";

export type CardPadding = "none" | "sm" | "md" | "lg";

const PADDING: Record<CardPadding, string> = {
	none: "",
	sm: "p-3",
	md: "p-4 md:p-5",
	lg: "p-5 md:p-7",
};

export interface CardStyle {
	padding?: CardPadding;
	/** Bigger radius and shadow (hero, dialogs) */
	elevated?: boolean;
	/** Hover lift for clickable cards */
	interactive?: boolean;
	/** Accent ring, e.g. the selected or highlighted card */
	highlight?: boolean;
	className?: string;
}

/** Card look for elements that are not <Card> (links, buttons…) */
export function cardClass({
	padding = "md",
	elevated = false,
	interactive = false,
	highlight = false,
	className,
}: CardStyle = {}): string {
	return cn(
		"border bg-surface text-text",
		elevated ? "rounded-ui-lg shadow-ui-md" : "rounded-ui-md shadow-ui-sm",
		highlight ? "border-accent/40 ring-4 ring-accent/10" : "border-border",
		interactive &&
			"tap block cursor-pointer transition-[translate,scale,box-shadow,border-color,background-color] duration-150 hover:-translate-y-0.5 hover:shadow-ui-md hover:border-border2 active:translate-y-0 active:scale-[.99] active:bg-surface2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
		PADDING[padding],
		className,
	);
}

export function Card({
	padding,
	elevated,
	interactive,
	highlight,
	className,
	...rest
}: ComponentProps<"div"> & CardStyle): JSX.Element {
	return (
		<div
			className={cardClass({
				padding,
				elevated,
				interactive,
				highlight,
				className,
			})}
			{...rest}
		/>
	);
}

/** Section title row with optional action on the right */
export function CardHeader({
	title,
	subtitle,
	action,
	className,
}: {
	title: ReactNode;
	subtitle?: ReactNode;
	action?: ReactNode;
	className?: string;
}): JSX.Element {
	return (
		<header className={cn("mb-3.5 flex items-start gap-3", className)}>
			<div className="min-w-0 flex-1">
				<h3 className="font-head text-ui-md font-semibold tracking-tight text-text">
					{title}
				</h3>
				{typeof subtitle !== "undefined" && (
					<p className="text-ui-sm text-text2">{subtitle}</p>
				)}
			</div>
			{action}
		</header>
	);
}
