import {
	type KeyboardEvent,
	type MouseEvent,
	type PointerEvent,
	useEffect,
	useRef,
	useState,
} from "react";

export interface PressPoint {
	left: number;
	top: number;
}

const MOVE_TOLERANCE = 10;
// Short taps should not flash the hold animation
const FEEDBACK_DELAY = 120;

let touchActiveReady = false;

/** iOS Safari only applies :active styles once a touch listener exists */
export function ensureTouchActive(): void {
	if (!touchActiveReady && typeof document !== "undefined") {
		touchActiveReady = true;
		document.addEventListener(
			"touchstart",
			() => {
				// Intentionally empty
			},
			{ passive: true },
		);
	}
}

interface LongPressHandlers {
	"data-pressing"?: true;
	onPointerDown: (ev: PointerEvent<HTMLElement>) => void;
	onPointerMove: (ev: PointerEvent<HTMLElement>) => void;
	onPointerUp: () => void;
	onPointerLeave: () => void;
	onPointerCancel: () => void;
	onClickCapture: (ev: MouseEvent<HTMLElement>) => void;
	onContextMenu: (ev: MouseEvent<HTMLElement>) => void;
	onKeyDown: (ev: KeyboardEvent<HTMLElement>) => void;
}

/**
 * Long press (touch / pen only, never mouse), right click and the
 * keyboard context-menu key all call `onLongPress` with a screen point.
 * Spread the returned props on the element and give it the
 * `hold-fill no-callout` classes for the visual feedback.
 */
export function useLongPress(
	onLongPress: (point: PressPoint) => void,
	{ delay = 450, disabled = false }: { delay?: number; disabled?: boolean } = {},
): LongPressHandlers {
	const [pressing, setPressing] = useState(false);
	const timerRef = useRef<number | null>(null);
	const feedbackRef = useRef<number | null>(null);
	const startRef = useRef<PressPoint | null>(null);
	const firedRef = useRef(false);

	function clearTimers(): void {
		if (timerRef.current !== null) {
			window.clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		if (feedbackRef.current !== null) {
			window.clearTimeout(feedbackRef.current);
			feedbackRef.current = null;
		}
	}

	function cancel(): void {
		clearTimers();
		startRef.current = null;
		setPressing(false);
	}

	useEffect(() => {
		ensureTouchActive();
		return (): void => {
			if (timerRef.current !== null) {
				window.clearTimeout(timerRef.current);
			}
			if (feedbackRef.current !== null) {
				window.clearTimeout(feedbackRef.current);
			}
		};
	}, []);

	function fire(point: PressPoint): void {
		clearTimers();
		firedRef.current = true;
		startRef.current = null;
		setPressing(false);
		if ("vibrate" in navigator) {
			navigator.vibrate(12);
		}
		onLongPress(point);
	}

	return {
		...(pressing && { "data-pressing": true }),
		onPointerDown(ev): void {
			// Desktop uses right click: holding the mouse does nothing
			if (disabled || ev.button !== 0 || ev.pointerType === "mouse") {
				return;
			}
			firedRef.current = false;
			const point = { left: ev.clientX, top: ev.clientY };
			startRef.current = point;
			feedbackRef.current = window.setTimeout(() => {
				setPressing(true);
			}, FEEDBACK_DELAY);
			timerRef.current = window.setTimeout(() => {
				fire(point);
			}, delay);
		},
		onPointerMove(ev): void {
			const start = startRef.current;
			if (
				start &&
				Math.hypot(ev.clientX - start.left, ev.clientY - start.top) > MOVE_TOLERANCE
			) {
				cancel();
			}
		},
		onPointerUp: cancel,
		onPointerLeave: cancel,
		onPointerCancel: cancel,
		onClickCapture(ev): void {
			// The release after a long press must not also navigate
			if (firedRef.current) {
				ev.preventDefault();
				ev.stopPropagation();
				firedRef.current = false;
			}
		},
		onContextMenu(ev): void {
			ev.preventDefault();
			// Android also sends contextmenu on long press: already handled
			if (disabled || startRef.current || firedRef.current) {
				return;
			}
			fire({ left: ev.clientX, top: ev.clientY });
			firedRef.current = false;
		},
		onKeyDown(ev): void {
			if (!disabled && (ev.key === "ContextMenu" || (ev.shiftKey && ev.key === "F10"))) {
				ev.preventDefault();
				const rect = ev.currentTarget.getBoundingClientRect();
				fire({ left: rect.left, top: rect.bottom });
				firedRef.current = false;
			}
		},
	};
}
