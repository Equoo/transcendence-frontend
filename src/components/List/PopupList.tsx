import {
	type PointerEvent,
	type ReactNode,
	useEffect,
	useEffectEvent,
	useRef,
	useState,
} from "react";
import type { JSX } from "react/jsx-runtime";
import { createPortal } from "react-dom";

import { useClickOutside } from "@/hooks/useClickOutside";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface Row {
	id: string;
	onClick: () => void;
	content: ReactNode;
}

const SHEET_QUERY = "(max-width: 64rem), (pointer: coarse)";
const DISMISS_DISTANCE = 80;

function BottomSheet({
	onClose,
	rows,
}: {
	onClose: () => void;
	rows: Row[];
}): JSX.Element {
	const clickOutsideRef = useClickOutside<HTMLDivElement>(
		useRef(null),
		onClose,
	);
	const close = useEffectEvent(onClose);
	const [dragStart, setDragStart] = useState<number | null>(null);
	const [dragY, setDragY] = useState(0);

	useEffect(() => {
		function onKeyDown(ev: KeyboardEvent): void {
			if (ev.key === "Escape" && !ev.defaultPrevented) {
				ev.preventDefault();
				close();
			}
		}

		const { overflow } = document.body.style;
		document.body.style.overflow = "hidden";
		document.addEventListener("keydown", onKeyDown);
		return (): void => {
			document.body.style.overflow = overflow;
			document.removeEventListener("keydown", onKeyDown);
		};
	}, []);

	function onDragStart(ev: PointerEvent<HTMLDivElement>): void {
		setDragStart(ev.clientY);
		ev.currentTarget.setPointerCapture(ev.pointerId);
	}

	function onDragMove(ev: PointerEvent<HTMLDivElement>): void {
		if (dragStart !== null) {
			setDragY(Math.max(0, ev.clientY - dragStart));
		}
	}

	function onDragEnd(): void {
		setDragStart(null);
		if (dragY > DISMISS_DISTANCE) {
			onClose();
		} else {
			setDragY(0);
		}
	}

	return createPortal(
		<div
			role="dialog"
			aria-modal="true"
			className="fixed inset-0 z-50 flex flex-col justify-end bg-text/20 animate-[fade-in_0.2s_ease-out]"
			onClick={(ev) => {
				ev.stopPropagation();
			}}
			onPointerDown={(ev) => {
				ev.stopPropagation();
			}}
			onContextMenu={(ev) => {
				ev.stopPropagation();
			}}
		>
			<div
				ref={clickOutsideRef}
				style={{ transform: `translateY(${dragY}px)` }}
				className={`bg-surface border-t border-border rounded-t-lg shadow-main pb-[max(0.5rem,env(safe-area-inset-bottom))] max-h-[80dvh] flex flex-col animate-sheet-up ${dragStart === null ? "transition-transform duration-200" : ""}`}
			>
				<div
					className="flex justify-center py-3 touch-none cursor-grab"
					onPointerDown={onDragStart}
					onPointerMove={onDragMove}
					onPointerUp={onDragEnd}
					onPointerCancel={onDragEnd}
				>
					<div className="h-1 w-10 rounded-full bg-border2" />
				</div>
				<ul className="flex flex-col px-2 overflow-y-auto">
					{rows.map((row) => (
						<li
							key={row.id}
							onClick={() => {
								row.onClick();
								onClose();
							}}
							className="text-text font-medium px-3 py-3 active:bg-hover rounded-md cursor-pointer"
						>
							{row.content}
						</li>
					))}
				</ul>
			</div>
		</div>,
		document.body,
	);
}

export default function PopupList({
	onClose,
	rows,
	className,
	bottomSheet = true,
}: {
	onClose: () => void;
	rows: Row[];
	className?: string;
	bottomSheet?: boolean;
}): JSX.Element {
	const isSheet = useMediaQuery(SHEET_QUERY) && bottomSheet;
	const clickOutsideRef = useClickOutside<HTMLUListElement>(
		useRef(null),
		onClose,
	);

	if (isSheet) {
		return <BottomSheet onClose={onClose} rows={rows} />;
	}

	return (
		<ul
			ref={clickOutsideRef}
			className={`absolute p-2 rounded-md flex flex-col z-50 ${className}`}
		>
			{rows.map((row) => (
				<li
					key={row.id}
					onClick={() => {
						row.onClick();
						onClose();
					}}
					className="text-text font-medium p-2 whitespace-nowrap hover:bg-hover rounded-md cursor-pointer"
				>
					{row.content}
				</li>
			))}
		</ul>
	);
}
