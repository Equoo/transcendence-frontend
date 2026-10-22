import { type JSX, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import {
	PiBellSlash,
	PiDotsThreeBold,
	PiHash,
	PiLockSimple,
	PiMegaphone,
	PiSpeakerHigh,
} from "react-icons/pi";
import { NavLink } from "react-router";

import { useShell } from "../layout/Shell";
import { cn } from "../lib/cn";
import { type PressPoint, useLongPress } from "../lib/useLongPress";
import { ContextMenu, type MenuEntry } from "../overlay/Menu";
import { Tooltip } from "../overlay/Tooltip";
import { CountBadge, Dot } from "../primitives/Badge";

export type ChannelKind = "text" | "announcement" | "voice";

export const CHANNEL_ICON: Record<ChannelKind, IconType> = {
	text: PiHash,
	announcement: PiMegaphone,
	voice: PiSpeakerHigh,
};

/** Channel title used in menus / sheets: icon + name */
export function ChannelLabel({
	name,
	kind = "text",
	isPrivate = false,
}: {
	name: string;
	kind?: ChannelKind;
	isPrivate?: boolean;
}): JSX.Element {
	const Icon = CHANNEL_ICON[kind];
	return (
		<span className="inline-flex min-w-0 items-center gap-1.5">
			<Icon aria-hidden className="shrink-0 text-muted" />
			<span className="truncate">{name}</span>
			{isPrivate && <PiLockSimple aria-hidden size={14} className="shrink-0 text-muted" />}
		</span>
	);
}

function itemClass({
	isActive,
	rail,
	unread,
	muted,
	hasActions,
}: {
	isActive: boolean;
	rail: boolean;
	unread: boolean;
	muted: boolean;
	hasActions: boolean;
}): string {
	return cn(
		"tap hold-fill no-callout flex items-center rounded-ui-sm font-medium cursor-pointer",
		"transition-[background-color,color,scale] duration-120 active:scale-[.97]",
		"focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
		rail ? "size-12 justify-center" : "min-h-ctl-md w-full gap-2 pr-2 pl-2.5 text-ui-base",
		isActive
			? "bg-accent-soft text-accent active:brightness-95"
			: "text-text2 hover:bg-hover hover:text-text active:bg-border active:text-text",
		unread && !isActive && "font-bold text-text",
		muted && !isActive && "opacity-55",
		hasActions && !rail && "pointer-fine:group-hover:pr-10 pointer-fine:group-focus-within:pr-10",
	);
}

/** Hover "⋯" button (mouse / keyboard). Touch users long-press instead. */
function SettingsButton({
	name,
	onOpen,
}: {
	name: string;
	onOpen: (point: PressPoint) => void;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	return (
		<button
			type="button"
			aria-label={t("ui.channelSettings", { name })}
			aria-haspopup="menu"
			onClick={(ev) => {
				const rect = ev.currentTarget.getBoundingClientRect();
				onOpen({ left: rect.left, top: rect.bottom });
			}}
			className="reveal tap absolute top-1/2 right-1.5 grid size-7 -translate-y-1/2 place-items-center rounded-ui-xs text-text2 cursor-pointer hover:bg-border hover:text-text active:scale-90 pointer-coarse:hidden"
		>
			<PiDotsThreeBold size={16} />
		</button>
	);
}

/** Lock / muted / mentions after the name, a dot in rail mode */
function ChannelIndicators({
	rail,
	isPrivate,
	muted,
	unread,
	mentions,
}: {
	rail: boolean;
	isPrivate: boolean;
	muted: boolean;
	unread: boolean;
	mentions: number;
}): JSX.Element | null {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();

	if (rail) {
		return mentions > 0 || unread ? (
			<Dot tone={mentions > 0 ? "error" : "neutral"} className="absolute top-2 right-2" />
		) : null;
	}
	return (
		<>
			{isPrivate && <PiLockSimple aria-hidden size={13} className="shrink-0 opacity-60" />}
			{muted && <PiBellSlash aria-label={t("ui.muted")} size={14} className="shrink-0" />}
			<CountBadge count={mentions} tone="error" />
		</>
	);
}

/**
 * Sidebar channel. Tap navigates; long press (touch only),
 * right click, the context-menu key or the hover "⋯" button open the
 * channel actions: a sheet on phones, a menu at the pointer elsewhere.
 */
export function ChannelItem({
	name,
	to,
	kind = "text",
	isPrivate = false,
	unread = false,
	mentions = 0,
	muted = false,
	actions,
	onClick,
}: {
	name: string;
	to: string;
	kind?: ChannelKind;
	isPrivate?: boolean;
	/** New messages: bold name + side marker */
	unread?: boolean;
	/** Mentions counter */
	mentions?: number;
	muted?: boolean;
	/** Settings overlay entries (edit, mute, delete…) */
	actions?: MenuEntry[];
	onClick?: () => void;
}): JSX.Element {
	const { navMode } = useShell();
	const rail = navMode === "rail";
	const [menuAt, setMenuAt] = useState<PressPoint | null>(null);
	const [link, setLink] = useState<HTMLAnchorElement | null>(null);
	const hasActions = Boolean(actions?.length);
	const press = useLongPress(setMenuAt, { disabled: !hasActions });
	const closeMenu = useCallback(() => {
		setMenuAt(null);
	}, []);
	const Icon = CHANNEL_ICON[kind];
	const label = <ChannelLabel name={name} kind={kind} isPrivate={isPrivate} />;

	const item = (
		<NavLink
			ref={setLink}
			to={to}
			onClick={onClick}
			{...press}
			{...(hasActions && { "aria-haspopup": "menu" as const })}
			className={({ isActive }) => itemClass({ isActive, rail, unread, muted, hasActions })}
		>
			<Icon size={rail ? 21 : 18} aria-hidden className={cn("shrink-0", !rail && "opacity-70")} />
			<span className={cn(rail ? "sr-only" : "min-w-0 flex-1 truncate")}>{name}</span>
			<ChannelIndicators rail={rail} isPrivate={isPrivate} muted={muted} unread={unread} mentions={mentions} />
		</NavLink>
	);

	return (
		<div className="group relative">
			{unread && !rail && (
				<span aria-hidden className="absolute top-1/2 left-0 z-1 h-2 w-1 -translate-y-1/2 rounded-r-full bg-text" />
			)}
			{rail ? (
				<Tooltip content={name} side="right">
					{item}
				</Tooltip>
			) : (
				item
			)}
			{hasActions && !rail && <SettingsButton name={name} onOpen={setMenuAt} />}
			{hasActions && (
				<ContextMenu
					label={label}
					items={actions ?? []}
					at={menuAt}
					onClose={closeMenu}
					returnFocus={link}
				/>
			)}
		</div>
	);
}
