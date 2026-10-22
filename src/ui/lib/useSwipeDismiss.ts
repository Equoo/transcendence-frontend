import { type PointerEvent, type RefObject, useRef } from "react";

export type SwipeDirection = "down" | "left" | "right";

const THRESHOLD = 80;

interface SwipeHandlers {
	onPointerDown: (ev: PointerEvent<HTMLElement>) => void;
	onPointerMove: (ev: PointerEvent<HTMLElement>) => void;
	onPointerUp: (ev: PointerEvent<HTMLElement>) => void;
	onPointerCancel: (ev: PointerEvent<HTMLElement>) => void;
}

function distance(direction: SwipeDirection, dx: number, dy: number): number {
	switch (direction) {
		case "down":
			return dy;
		case "left":
			return -dx;
		case "right":
			return dx;
		default:
			return 0;
	}
}

/**
 * Lets a touch user drag a sheet / drawer away. The panel follows the
 * finger and is dismissed past THRESHOLD px, otherwise it snaps back.
 * Mouse pointers are ignored.
 */
export function useSwipeDismiss(
	panelRef: RefObject<HTMLElement | null>,
	direction: SwipeDirection,
	onDismiss: () => void,
): SwipeHandlers {
	const startRef = useRef<{ posX: number; posY: number } | null>(null);
	const offsetRef = useRef(0);

	function move(px: number): void {
		const panel = panelRef.current;
		if (panel) {
			const axis = direction === "down" ? "Y" : "X";
			const sign = direction === "left" ? -1 : 1;
			panel.style.transform =
				px > 0 ? `translate${axis}(${sign * px}px)` : "";
		}
	}

	function end(): void {
		const dismissed = offsetRef.current > THRESHOLD;
		startRef.current = null;
		offsetRef.current = 0;
		const panel = panelRef.current;
		if (panel) {
			panel.style.transition = "transform 180ms ease-out";
			if (!dismissed) {
				move(0);
			}
		}
		if (dismissed) {
			onDismiss();
		}
	}

	return {
		onPointerDown(ev): void {
			if (ev.pointerType !== "mouse") {
				startRef.current = { posX: ev.clientX, posY: ev.clientY };
				if (panelRef.current) {
					panelRef.current.style.transition = "none";
				}
			}
		},
		onPointerMove(ev): void {
			if (startRef.current) {
				offsetRef.current = Math.max(
					0,
					distance(
						direction,
						ev.clientX - startRef.current.posX,
						ev.clientY - startRef.current.posY,
					),
				);
				move(offsetRef.current);
			}
		},
		onPointerUp(): void {
			if (startRef.current) {
				end();
			}
		},
		onPointerCancel(): void {
			if (startRef.current) {
				end();
			}
		},
	};
}
