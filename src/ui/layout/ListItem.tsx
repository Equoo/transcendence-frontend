import type { JSX, ReactNode } from "react";
import { Link } from "react-router";

import { cn } from "../lib/cn";

/**
 * Generic row: conversation, friend, member, file… The whole row is
 * clickable (`to` / `onClick`) while `actions` stay separately
 * clickable; they appear on hover with a mouse, always on touch.
 */
export function ListItem({
	leading,
	title,
	subtitle,
	meta,
	trailing,
	actions,
	to,
	onClick,
	active = false,
	unread = false,
	dense = false,
	className,
}: {
	leading?: ReactNode;
	title: ReactNode;
	subtitle?: ReactNode;
	/** Small text top-right (time, size…) */
	meta?: ReactNode;
	/** Always visible end content (badge, chevron…) */
	trailing?: ReactNode;
	/** Hover / touch actions (icon buttons, menu) */
	actions?: ReactNode;
	to?: string;
	onClick?: () => void;
	active?: boolean;
	unread?: boolean;
	dense?: boolean;
	className?: string;
}): JSX.Element {
	const stretched =
		"tap no-callout outline-none after:absolute after:inset-0 after:rounded-ui-sm focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-accent";

	const titleNode =
		typeof to === "string" ? (
			<Link to={to} onClick={onClick} data-row-target className={stretched} {...(active && { "aria-current": "page" })}>
				{title}
			</Link>
		) : onClick ? (
			<button type="button" onClick={onClick} data-row-target className={cn(stretched, "cursor-pointer text-left")}>
				{title}
			</button>
		) : (
			title
		);

	const interactive = typeof to === "string" || Boolean(onClick);

	return (
		<div
			className={cn(
				"group relative flex items-center gap-3 rounded-ui-sm px-2.5 transition-[background-color,scale] duration-120",
				"has-[[data-row-target]:active]:scale-[.985] has-[[data-row-target]:active]:bg-border",
				dense ? "min-h-ctl-md py-1" : "min-h-14 py-2",
				active ? "bg-accent-soft" : interactive && "hover:bg-hover",
				className,
			)}
		>
			{typeof leading !== "undefined" && <div className="shrink-0">{leading}</div>}
			<div className="min-w-0 flex-1">
				<div className="flex items-baseline gap-2">
					<span
						className={cn(
							"min-w-0 flex-1 truncate text-ui-base",
							active ? "text-accent" : "text-text",
							unread ? "font-bold" : "font-medium",
						)}
					>
						{titleNode}
					</span>
					{typeof meta !== "undefined" && (
						<span className="shrink-0 text-ui-xs text-muted">{meta}</span>
					)}
				</div>
				{typeof subtitle !== "undefined" && (
					<p
						className={cn(
							"truncate text-ui-sm",
							unread ? "font-semibold text-text" : "text-text2",
						)}
					>
						{subtitle}
					</p>
				)}
			</div>
			{typeof actions !== "undefined" && (
				<div className="reveal relative z-1 flex shrink-0 items-center gap-0.5">
					{actions}
				</div>
			)}
			{typeof trailing !== "undefined" && <div className="relative shrink-0">{trailing}</div>}
		</div>
	);
}
