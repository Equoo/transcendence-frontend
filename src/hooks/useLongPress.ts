import { useEffect, useRef } from "react";

export type LongPressProps = Pick<
	React.HTMLAttributes<HTMLElement>,
	| "onPointerDown"
	| "onPointerMove"
	| "onPointerUp"
	| "onPointerCancel"
	| "onPointerLeave"
	| "onContextMenu"
	| "onClickCapture"
	| "onDragStart"
	| "draggable"
>;

export interface LongPressOptions {
	delay?: number;
	moveThreshold?: number;
}

export function useLongPress(
	callback: (event: React.PointerEvent<HTMLElement>) => void,
	{ delay = 500, moveThreshold = 10 }: LongPressOptions = {},
): LongPressProps {
	const callbackRef = useRef(callback);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const startRef = useRef<{ posX: number; posY: number } | null>(null);
	const triggeredRef = useRef(false);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	const clear = (): void => {
		if (timerRef.current !== null) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		startRef.current = null;
	};

	useEffect(() => clear, []);

	const handlePointerDown = (event: React.PointerEvent<HTMLElement>): void => {
		triggeredRef.current = false;
		if (event.pointerType !== "touch") {
			return;
		}
		clear();
		startRef.current = { posX: event.clientX, posY: event.clientY };
		timerRef.current = setTimeout(() => {
			triggeredRef.current = true;
			timerRef.current = null;
			callbackRef.current(event);
		}, delay);
	};

	const handlePointerMove = (event: React.PointerEvent<HTMLElement>): void => {
		if (event.pointerType !== "touch" || !startRef.current) {
			return;
		}
		const dx = event.clientX - startRef.current.posX;
		const dy = event.clientY - startRef.current.posY;
		if (Math.hypot(dx, dy) > moveThreshold) {
			clear();
		}
	};

	const handlePointerEnd = (event: React.PointerEvent<HTMLElement>): void => {
		if (event.pointerType !== "touch") {
			return;
		}
		clear();
	};

	const handleContextMenu = (event: React.MouseEvent<HTMLElement>): void => {
		if (startRef.current || triggeredRef.current) {
			event.preventDefault();
		}
	};

	const handleClickCapture = (event: React.MouseEvent<HTMLElement>): void => {
		if (!triggeredRef.current) {
			return;
		}
		triggeredRef.current = false;
		event.preventDefault();
		event.stopPropagation();
	};

	const handleDragStart = (event: React.DragEvent<HTMLElement>): void => {
		if (startRef.current || triggeredRef.current) {
			event.preventDefault();
		}
	};

	return {
		draggable: false,
		onDragStart: handleDragStart,
		onPointerDown: handlePointerDown,
		onPointerMove: handlePointerMove,
		onPointerUp: handlePointerEnd,
		onPointerCancel: handlePointerEnd,
		onPointerLeave: handlePointerEnd,
		onContextMenu: handleContextMenu,
		onClickCapture: handleClickCapture,
	};
}
