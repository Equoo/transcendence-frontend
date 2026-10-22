import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

export type FloatingPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end";

const OFFSET = 6;
const MARGIN = 8;

/**
 * Positions a `popover="manual"` panel next to its anchor (top layer,
 * so it escapes overflow and dialogs). Flips vertically when there is
 * no room and stays inside the viewport. Closes on scroll / resize.
 * Returns the callback ref to put on the panel.
 */
export function useFloating({
	anchor,
	point = null,
	open,
	placement = "bottom-start",
	matchWidth = false,
	onClose,
}: {
	anchor: HTMLElement | null;
	/** Anchor to a screen point instead (context menus) */
	point?: { left: number; top: number } | null;
	open: boolean;
	placement?: FloatingPlacement;
	matchWidth?: boolean;
	onClose: () => void;
}): (el: HTMLElement | null) => void {
	const panelRef = useRef<HTMLElement | null>(null);

	useLayoutEffect(() => {
		const panel = panelRef.current;
		if (!panel) {
			return;
		}
		if (!open || (!anchor && !point)) {
			if (panel.matches(":popover-open")) {
				panel.hidePopover();
			}
			return;
		}

		const rect = point
			? new DOMRect(point.left, point.top, 0, 0)
			: (anchor?.getBoundingClientRect() ?? new DOMRect());
		if (matchWidth) {
			panel.style.minWidth = `${rect.width}px`;
		}
		panel.showPopover();

		const { offsetWidth: width, offsetHeight: height } = panel;
		const spaceBelow = window.innerHeight - rect.bottom;
		const wantsTop = placement.startsWith("top");
		const fitsBelow = spaceBelow >= height + OFFSET;
		const fitsAbove = rect.top >= height + OFFSET;
		const onTop = wantsTop ? fitsAbove || !fitsBelow : !fitsBelow && fitsAbove;

		const top = onTop ? rect.top - height - OFFSET : rect.bottom + OFFSET;
		const left = placement.endsWith("end") ? rect.right - width : rect.left;

		panel.style.top = `${Math.max(MARGIN, top)}px`;
		panel.style.left = `${Math.min(
			Math.max(MARGIN, left),
			window.innerWidth - width - MARGIN,
		)}px`;
	}, [open, placement, matchWidth, anchor, point]);

	useEffect(() => {
		function close(ev: Event): void {
			if (
				ev.type === "scroll" &&
				ev.target instanceof Node &&
				panelRef.current?.contains(ev.target)
			) {
				return;
			}
			onClose();
		}
		if (open) {
			window.addEventListener("resize", close);
			window.addEventListener("scroll", close, true);
		}
		return (): void => {
			window.removeEventListener("resize", close);
			window.removeEventListener("scroll", close, true);
		};
	}, [open, onClose]);

	return useCallback((el: HTMLElement | null) => {
		panelRef.current = el;
	}, []);
}
