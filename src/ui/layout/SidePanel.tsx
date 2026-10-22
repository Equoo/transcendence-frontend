import type { JSX, ReactNode } from "react";
import type { IconType } from "react-icons";
import { NavLink } from "react-router";

import { cn } from "../lib/cn";
import { Tooltip } from "../overlay/Tooltip";
import { CountBadge, Dot } from "../primitives/Badge";
import { useShell } from "./Shell";

/** Sidebar body: fixed header / footer, scrollable middle. Adapts to the shell's rail mode. */
export function SidePanel({
	header,
	compactHeader,
	footer,
	compactFooter,
	children,
	className,
}: {
	header?: ReactNode;
	/** Header in rail mode (logo only…) */
	compactHeader?: ReactNode;
	footer?: ReactNode;
	compactFooter?: ReactNode;
	children: ReactNode;
	className?: string;
}): JSX.Element {
	const { navMode } = useShell();
	const rail = navMode === "rail";

	return (
		<div className={cn("flex min-h-0 w-full flex-1 flex-col py-3", rail ? "items-center px-2" : "px-3", className)}>
			{Boolean(rail ? compactHeader : header) && (
				<div className="mb-3 shrink-0">{rail ? compactHeader : header}</div>
			)}
			<div className={cn("flex min-h-0 w-full flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain", rail && "items-center")}>
				{children}
			</div>
			{Boolean(rail ? compactFooter : footer) && (
				<div className="mt-3 w-full shrink-0 border-t border-border pt-3">
					{rail ? compactFooter : footer}
				</div>
			)}
		</div>
	);
}

/** Titled group of items. Becomes a thin divider in rail mode. */
export function SidePanelSection({
	title,
	action,
	children,
}: {
	title: string;
	action?: ReactNode;
	children: ReactNode;
}): JSX.Element {
	const { navMode } = useShell();

	if (navMode === "rail") {
		return (
			<div role="group" aria-label={title} className="flex w-full flex-col items-center gap-0.5">
				<span aria-hidden className="my-2 h-px w-8 bg-border2" />
				{children}
			</div>
		);
	}
	return (
		<div role="group" aria-label={title} className="mt-4 flex flex-col gap-0.5">
			<div className="flex h-7 items-center justify-between px-2.5">
				<span className="text-ui-2xs font-bold tracking-wider text-muted uppercase">
					{title}
				</span>
				{action}
			</div>
			{children}
		</div>
	);
}

interface NavItemProps {
	label: string;
	icon?: IconType;
	/** Leading content instead of an icon (#, avatar…) */
	leading?: ReactNode;
	to?: string;
	/** Match the path exactly (for "/") */
	end?: boolean;
	onClick?: () => void;
	/** Force the active state (for non-route items) */
	active?: boolean;
	badge?: number;
	/** Bold label: unread content */
	unread?: boolean;
}

function itemClass(active: boolean, rail: boolean, unread: boolean): string {
	return cn(
		"tap relative flex items-center rounded-ui-sm font-medium cursor-pointer transition-[background-color,color,scale] duration-120 active:scale-[.97]",
		"focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
		rail ? "size-12 justify-center" : "min-h-ctl-md w-full gap-3 px-2.5 text-ui-base",
		active
			? "bg-accent-soft text-accent active:brightness-95"
			: "text-text2 hover:bg-hover hover:text-text active:bg-border active:text-text",
		unread && !active && "font-bold text-text",
	);
}

/** Sidebar entry: router link or button. Icon + tooltip only in rail mode. */
export function NavItem({
	label,
	icon: Icon,
	leading,
	to,
	end,
	onClick,
	active,
	badge = 0,
	unread = false,
}: NavItemProps): JSX.Element {
	const { navMode } = useShell();
	const rail = navMode === "rail";

	const content = (
		<>
			{Icon ? <Icon size={rail ? 21 : 19} aria-hidden className="shrink-0" /> : leading}
			<span className={cn(rail ? "sr-only" : "flex-1 truncate")}>{label}</span>
			{rail
				? badge > 0 && <Dot className="absolute top-2 right-2" />
				: <CountBadge count={badge} />}
		</>
	);

	const item =
		typeof to === "string" ? (
			<NavLink
				to={to}
				end={end}
				onClick={onClick}
				className={({ isActive }) => itemClass(active ?? isActive, rail, unread)}
			>
				{content}
			</NavLink>
		) : (
			<button
				type="button"
				onClick={onClick}
				{...(active === true && { "aria-current": "page" })}
				className={itemClass(active ?? false, rail, unread)}
			>
				{content}
			</button>
		);

	return rail ? (
		<Tooltip content={label} side="right">
			{item}
		</Tooltip>
	) : (
		item
	);
}
