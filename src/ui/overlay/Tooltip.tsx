import {
	type FocusEvent,
	type JSX,
	type PointerEvent,
	type ReactNode,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "../lib/cn";

const MARGIN = 8;

/**
 * Hover (mouse) or keyboard-focus label. Never opens on touch: a tap
 * would leave it stuck, and the label is already exposed through aria.
 */
export function Tooltip({
	content,
	children,
	side = "top",
	className,
}: {
	content: ReactNode;
	children: ReactNode;
	side?: "top" | "right";
	className?: string;
}): JSX.Element {
	const id = useId();
	const anchorRef = useRef<HTMLSpanElement>(null);
	const tipRef = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		function close(): void {
			setOpen(false);
		}
		if (open) {
			window.addEventListener("scroll", close, true);
			window.addEventListener("resize", close);
		}
		return (): void => {
			window.removeEventListener("scroll", close, true);
			window.removeEventListener("resize", close);
		};
	}, [open]);

	useLayoutEffect(() => {
		const anchor = anchorRef.current;
		const tip = tipRef.current;
		if (!open || !anchor || !tip) {
			return;
		}
		const rect = anchor.getBoundingClientRect();
		const { width, height } = tip.getBoundingClientRect();
		const above = rect.top - height - MARGIN;
		const top =
			side === "right"
				? rect.top + rect.height / 2 - height / 2
				: above < MARGIN
					? rect.bottom + MARGIN
					: above;
		const left =
			side === "right"
				? rect.right + MARGIN
				: rect.left + rect.width / 2 - width / 2;
		tip.style.top = `${top}px`;
		tip.style.left = `${Math.min(Math.max(left, MARGIN), window.innerWidth - width - MARGIN)}px`;
		tip.style.visibility = "visible";
	}, [open, side]);

	function onPointerEnter(ev: PointerEvent): void {
		if (ev.pointerType === "mouse") {
			setOpen(true);
		}
	}
	function onFocus(ev: FocusEvent): void {
		if (ev.target.matches(":focus-visible")) {
			setOpen(true);
		}
	}
	function hide(): void {
		setOpen(false);
	}

	return (
		<>
			<span
				ref={anchorRef}
				className={cn("inline-flex", className)}
				{...(open && { "aria-describedby": id })}
				onPointerEnter={onPointerEnter}
				onPointerLeave={hide}
				onPointerDown={hide}
				onFocus={onFocus}
				onBlur={hide}
			>
				{children}
			</span>
			{open &&
				createPortal(
					<div
						ref={tipRef}
						id={id}
						role="tooltip"
						style={{ top: 0, left: 0, visibility: "hidden" }}
						className="fixed z-60 max-w-[min(20rem,calc(100vw-1rem))] rounded-ui-xs bg-text px-2.5 py-1.5 font-main text-ui-xs font-medium text-surface shadow-ui-md pointer-events-none wrap-break-word animate-in"
					>
						{content}
					</div>,
					document.body,
				)}
		</>
	);
}
