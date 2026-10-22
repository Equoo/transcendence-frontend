import { type JSX, type ReactNode, useCallback, useId, useState } from "react";
import { PiCaretDownBold, PiPlusBold } from "react-icons/pi";

import { useShell } from "../layout/Shell";
import { cn } from "../lib/cn";
import { type PressPoint, useLongPress } from "../lib/useLongPress";
import { ContextMenu, type MenuEntry } from "../overlay/Menu";
import { IconButton } from "../primitives/IconButton";

/**
 * Collapsible group of channels. The header toggles; long press (touch) /
 * right click opens the category actions (add channel, edit, delete…).
 * The "+" button is always visible on touch, on hover with a mouse.
 */
export function ChannelCategory({
	name,
	collapsed,
	defaultCollapsed = false,
	onCollapsedChange,
	onAdd,
	addLabel,
	actions,
	children,
}: {
	name: string;
	collapsed?: boolean;
	defaultCollapsed?: boolean;
	onCollapsedChange?: (collapsed: boolean) => void;
	/** Shows the "+" button */
	onAdd?: () => void;
	addLabel?: string;
	/** Settings overlay entries */
	actions?: MenuEntry[];
	children: ReactNode;
}): JSX.Element {
	const { navMode } = useShell();
	const headerId = useId();
	const listId = useId();
	const [inner, setInner] = useState(defaultCollapsed);
	const isCollapsed = collapsed ?? inner;
	const [menuAt, setMenuAt] = useState<PressPoint | null>(null);
	const [header, setHeader] = useState<HTMLButtonElement | null>(null);
	const hasActions = Boolean(actions?.length);
	const press = useLongPress(setMenuAt, { disabled: !hasActions });
	const closeMenu = useCallback(() => {
		setMenuAt(null);
	}, []);

	if (navMode === "rail") {
		return (
			<div role="group" aria-label={name} className="flex w-full flex-col items-center gap-0.5">
				<span aria-hidden className="my-2 h-px w-8 bg-border2" />
				{children}
			</div>
		);
	}

	return (
		<div role="group" aria-labelledby={headerId} className="mt-4 flex flex-col">
			<div className="group flex items-center gap-1 pr-1">
				<button
					ref={setHeader}
					id={headerId}
					type="button"
					aria-expanded={!isCollapsed}
					aria-controls={listId}
					onClick={() => {
						setInner(!isCollapsed);
						onCollapsedChange?.(!isCollapsed);
					}}
					{...press}
					className={cn(
						"tap hold-fill no-callout flex min-h-8 min-w-0 flex-1 items-center gap-1 rounded-ui-xs px-1.5 cursor-pointer",
						"text-ui-2xs font-bold tracking-wider text-muted uppercase",
						"hover:text-text2 active:bg-border/70 active:text-text2",
						"focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
						"pointer-coarse:min-h-10",
					)}
				>
					<PiCaretDownBold
						size={10}
						aria-hidden
						className={cn("shrink-0 transition-transform duration-200", isCollapsed && "-rotate-90")}
					/>
					<span className="truncate">{name}</span>
				</button>
				{onAdd && (
					<IconButton
						icon={PiPlusBold}
						label={addLabel ?? name}
						size="sm"
						onClick={onAdd}
						className="reveal size-7 pointer-coarse:size-10"
					/>
				)}
			</div>
			<div
				id={listId}
				inert={isCollapsed}
				className={cn(
					"grid transition-[grid-template-rows] duration-200 ease-out",
					isCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
				)}
			>
				<div className="flex min-h-0 flex-col gap-0.5 overflow-hidden pl-1">{children}</div>
			</div>
			{hasActions && (
				<ContextMenu
					label={name}
					items={actions ?? []}
					at={menuAt}
					onClose={closeMenu}
					returnFocus={header}
				/>
			)}
		</div>
	);
}
