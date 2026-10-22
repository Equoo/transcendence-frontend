import {
	type JSX,
	type ReactNode,
	useCallback,
	useEffect,
	useId,
	useState,
} from "react";

import { cn } from "../lib/cn";
import { useBreakpoint } from "../lib/useBreakpoint";
import { type FloatingPlacement, useFloating } from "../lib/useFloating";
import { Sheet } from "./Dialog";

export interface TriggerProps {
	ref: (el: HTMLButtonElement | null) => void;
	onClick: () => void;
	"aria-haspopup": "menu" | "dialog";
	"aria-expanded": boolean;
	"aria-controls": string;
}

/** Open state + outside click / Escape handling for anchored panels */
export function useAnchoredPanel(kind: "menu" | "dialog"): {
	open: boolean;
	setOpen: (open: boolean) => void;
	close: () => void;
	panelId: string;
	trigger: HTMLButtonElement | null;
	setTrigger: (el: HTMLButtonElement | null) => void;
	triggerProps: TriggerProps;
} {
	const [open, setOpen] = useState(false);
	const panelId = useId();
	const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);
	const close = useCallback(() => {
		setOpen(false);
	}, []);

	useEffect(() => {
		function onPointerDown(ev: PointerEvent): void {
			const target = ev.target as Node;
			const panel = document.getElementById(panelId);
			if (!panel?.contains(target) && !trigger?.contains(target)) {
				setOpen(false);
			}
		}
		if (open) {
			document.addEventListener("pointerdown", onPointerDown);
		}
		return (): void => {
			document.removeEventListener("pointerdown", onPointerDown);
		};
	}, [open, panelId, trigger]);

	return {
		open,
		setOpen,
		close,
		panelId,
		trigger,
		setTrigger,
		triggerProps: {
			ref: setTrigger,
			onClick(): void {
				setOpen(!open);
			},
			"aria-haspopup": kind,
			"aria-expanded": open,
			"aria-controls": panelId,
		},
	};
}

export const FLOATING_PANEL =
	"fixed inset-auto m-0 rounded-ui-md border border-border bg-surface p-1.5 font-main text-text shadow-ui-md animate-in";

/**
 * Free content anchored to a trigger. On phones it opens as a bottom
 * sheet instead. `children` can be a function receiving `close`.
 */
export function Popover({
	trigger,
	label,
	placement = "bottom-start",
	className,
	children,
}: {
	trigger: (props: TriggerProps) => ReactNode;
	/** Accessible name, also the sheet title on phones */
	label: string;
	placement?: FloatingPlacement;
	className?: string;
	children: ReactNode | ((close: () => void) => ReactNode);
}): JSX.Element {
	const { isPhone } = useBreakpoint();
	const { open, close, panelId, trigger: anchor, triggerProps } =
		useAnchoredPanel("dialog");
	const content = typeof children === "function" ? children(close) : children;

	const setPanel = useFloating({ anchor, open: open && !isPhone, placement, onClose: close });

	return (
		<>
			{trigger(triggerProps)}
			{isPhone ? (
				open && (
					<Sheet title={label} onClose={close} className="px-5">
						{content}
					</Sheet>
				)
			) : (
				<div
					ref={setPanel}
					id={panelId}
					role="dialog"
					aria-label={label}
					popover="manual"
					onKeyDown={(ev) => {
						if (ev.key === "Escape") {
							ev.stopPropagation();
							close();
							anchor?.focus();
						}
					}}
					className={cn(FLOATING_PANEL, "max-w-[min(24rem,calc(100vw-1rem))] p-4", className)}
				>
					{open && content}
				</div>
			)}
		</>
	);
}
