import {
	type JSX,
	type KeyboardEvent,
	type ReactNode,
	useEffect,
	useEffectEvent,
	useId,
} from "react";
import type { IconType } from "react-icons";

import { cn } from "../lib/cn";
import { useBreakpoint } from "../lib/useBreakpoint";
import { type FloatingPlacement, useFloating } from "../lib/useFloating";
import type { PressPoint } from "../lib/useLongPress";
import { Sheet } from "./Dialog";
import { FLOATING_PANEL, type TriggerProps, useAnchoredPanel } from "./Popover";

export interface MenuAction {
	id: string;
	label: string;
	icon?: IconType;
	onSelect: () => void;
	danger?: boolean;
	disabled?: boolean;
	/** Right-aligned hint, e.g. a shortcut */
	hint?: string;
}

export type MenuEntry = MenuAction | { id: string; separator: true };

function isSeparator(entry: MenuEntry): entry is { id: string; separator: true } {
	return "separator" in entry;
}

function MenuRows({
	items,
	large,
	onSelect,
}: {
	items: MenuEntry[];
	large: boolean;
	onSelect: (item: MenuAction) => void;
}): JSX.Element {
	return (
		<>
			{items.map((entry) => {
				if (isSeparator(entry)) {
					return <div key={entry.id} role="separator" className="mx-2 my-1.5 h-px bg-border" />;
				}
				const Icon = entry.icon;
				const danger = entry.danger === true;
				return (
					<button
						key={entry.id}
						type="button"
						role="menuitem"
						disabled={entry.disabled}
						onClick={() => {
							onSelect(entry);
						}}
						className={cn(
							"tap flex w-full items-center gap-3 rounded-ui-sm px-3 text-left font-medium cursor-pointer outline-none transition-colors duration-100",
							"disabled:cursor-not-allowed disabled:opacity-50",
							large ? "h-12 text-ui-md" : "h-9 text-ui-sm",
							danger
								? "text-error hover:bg-error-soft focus-visible:bg-error-soft active:bg-error-soft"
								: "text-text hover:bg-hover focus-visible:bg-hover active:bg-border",
						)}
					>
						{Icon && (
							<Icon size={large ? 20 : 17} aria-hidden className={cn("shrink-0", !danger && "text-text2")} />
						)}
						<span className="flex-1 truncate">{entry.label}</span>
						{Boolean(entry.hint) && <span className="text-ui-xs text-muted">{entry.hint}</span>}
					</button>
				);
			})}
		</>
	);
}

function onMenuKeyDown(ev: KeyboardEvent<HTMLElement>, close: (refocus: boolean) => void): void {
	const items = [
		...ev.currentTarget.querySelectorAll<HTMLButtonElement>("[role=menuitem]:not(:disabled)"),
	];
	const index = items.indexOf(document.activeElement as HTMLButtonElement);
	const last = items.length - 1;
	const next: Record<string, number> = {
		ArrowDown: index >= last ? 0 : index + 1,
		ArrowUp: index <= 0 ? last : index - 1,
		Home: 0,
		End: last,
	};
	if (ev.key in next) {
		ev.preventDefault();
		items[next[ev.key]]?.focus();
	} else if (ev.key === "Escape" || ev.key === "Tab") {
		ev.stopPropagation();
		close(ev.key === "Escape");
	}
}

function focusFirstItem(panelId: string): void {
	document
		.getElementById(panelId)
		?.querySelector<HTMLButtonElement>("[role=menuitem]:not(:disabled)")
		?.focus();
}

/**
 * Action menu opened by a trigger. Popover with keyboard navigation
 * on desktop, bottom sheet with large rows on phones.
 */
export function Menu({
	trigger,
	label,
	items,
	placement = "bottom-end",
	header,
}: {
	trigger: (props: TriggerProps) => ReactNode;
	/** Accessible name, also the sheet title on phones */
	label: string;
	items: MenuEntry[];
	placement?: FloatingPlacement;
	/** Optional content above the items (e.g. emoji reactions) */
	header?: ReactNode;
}): JSX.Element {
	const { isPhone } = useBreakpoint();
	const { open, close, panelId, trigger: anchor, triggerProps } = useAnchoredPanel("menu");
	const setPanel = useFloating({ anchor, open: open && !isPhone, placement, onClose: close });

	useEffect(() => {
		if (open && !isPhone) {
			focusFirstItem(panelId);
		}
	}, [open, isPhone, panelId]);

	function select(item: MenuAction): void {
		close();
		if (!isPhone) {
			anchor?.focus();
		}
		item.onSelect();
	}

	return (
		<>
			{trigger(triggerProps)}
			{isPhone ? (
				open && (
					<Sheet title={label} onClose={close}>
						{header}
						<div role="menu" aria-label={label} className="flex flex-col">
							<MenuRows items={items} large onSelect={select} />
						</div>
					</Sheet>
				)
			) : (
				<div
					ref={setPanel}
					id={panelId}
					role="menu"
					aria-label={label}
					popover="manual"
					onKeyDown={(ev) => {
						onMenuKeyDown(ev, (refocus) => {
							close();
							if (refocus) {
								anchor?.focus();
							}
						});
					}}
					className={cn(FLOATING_PANEL, "min-w-48 max-w-72")}
				>
					{open && (
						<>
							{header}
							<MenuRows items={items} large={false} onSelect={select} />
						</>
					)}
				</div>
			)}
		</>
	);
}

/**
 * Menu opened at a screen point: long press, right click, context-menu
 * key (see useLongPress). Bottom sheet on phones. Render it with
 * `at = null` when closed.
 */
export function ContextMenu({
	label,
	items,
	at,
	onClose,
	header,
	returnFocus,
}: {
	/** Accessible name, also the sheet title on phones */
	label: ReactNode;
	items: MenuEntry[];
	at: PressPoint | null;
	onClose: () => void;
	/** Content above the items (preview of the target…) */
	header?: ReactNode;
	/** Element focused again after closing with the keyboard */
	returnFocus?: HTMLElement | null;
}): JSX.Element | null {
	const { isPhone } = useBreakpoint();
	const panelId = useId();
	const open = at !== null;
	const setPanel = useFloating({ anchor: null, point: at, open: open && !isPhone, onClose });
	const closeOutside = useEffectEvent((target: Node) => {
		if (!document.getElementById(panelId)?.contains(target)) {
			onClose();
		}
	});

	useEffect(() => {
		function onPointerDown(ev: PointerEvent): void {
			closeOutside(ev.target as Node);
		}
		if (open && !isPhone) {
			focusFirstItem(panelId);
			document.addEventListener("pointerdown", onPointerDown);
		}
		return (): void => {
			document.removeEventListener("pointerdown", onPointerDown);
		};
	}, [open, isPhone, panelId]);

	function select(item: MenuAction): void {
		onClose();
		item.onSelect();
	}

	if (isPhone) {
		return open ? (
			<Sheet title={label} onClose={onClose}>
				{header}
				<div role="menu" className="flex flex-col">
					<MenuRows items={items} large onSelect={select} />
				</div>
			</Sheet>
		) : null;
	}

	return (
		<div
			ref={setPanel}
			id={panelId}
			role="menu"
			popover="manual"
			onKeyDown={(ev) => {
				onMenuKeyDown(ev, (refocus) => {
					onClose();
					if (refocus) {
						returnFocus?.focus();
					}
				});
			}}
			className={cn(FLOATING_PANEL, "min-w-52 max-w-72")}
		>
			{open && (
				<>
					{Boolean(header) && <div className="mb-1 border-b border-border px-2 pt-1 pb-2">{header}</div>}
					<MenuRows items={items} large={false} onSelect={select} />
				</>
			)}
		</div>
	);
}
