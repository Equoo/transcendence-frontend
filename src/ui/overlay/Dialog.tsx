import {
	type JSX,
	type ReactNode,
	useEffect,
	useId,
	useRef,
} from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { PiX } from "react-icons/pi";

import { cn } from "../lib/cn";
import { type SwipeDirection, useSwipeDismiss } from "../lib/useSwipeDismiss";
import { IconButton } from "../primitives/IconButton";

export type DialogPresentation =
	| "center"
	| "sheet"
	| "fullscreen"
	| "drawer-start"
	| "drawer-end";

const CONTAINER: Record<DialogPresentation, string> = {
	center: "items-center justify-center p-4",
	sheet: "items-end justify-center",
	fullscreen: "",
	"drawer-start": "justify-start",
	"drawer-end": "justify-end",
};

const PANEL: Record<DialogPresentation, string> = {
	center: "w-full max-h-[calc(100dvh-2rem)] rounded-ui-lg animate-dialog-in",
	sheet: "w-full max-w-xl max-h-[92dvh] rounded-t-ui-lg pb-[env(safe-area-inset-bottom)] animate-sheet-in",
	fullscreen: "size-full pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] animate-sheet-in",
	"drawer-start": "h-full w-[min(var(--spacing-side),85vw)] border-r pt-[env(safe-area-inset-top)] animate-drawer-start-in touch-pan-y",
	"drawer-end": "h-full w-[min(var(--spacing-aside),92vw)] border-l pt-[env(safe-area-inset-top)] animate-drawer-end-in touch-pan-y",
};

const SWIPE: Partial<Record<DialogPresentation, SwipeDirection>> = {
	sheet: "down",
	"drawer-start": "left",
	"drawer-end": "right",
};

/**
 * Modal surface on the native <dialog>: top layer, focus trap, Escape
 * and focus restore come from the browser. Mount it to open, unmount
 * to close. Sheets and drawers can be swiped away on touch.
 */
export function DialogRoot({
	presentation,
	onClose,
	labelledBy,
	label,
	describedBy,
	dismissible = true,
	className,
	children,
}: {
	presentation: DialogPresentation;
	onClose: () => void;
	labelledBy?: string;
	/** Accessible name when there is no visible title */
	label?: string;
	describedBy?: string;
	/** Escape / backdrop / swipe close it (default true) */
	dismissible?: boolean;
	className?: string;
	children: ReactNode;
}): JSX.Element {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const pressedBackdropRef = useRef(false);
	const unmountingRef = useRef(false);
	function requestClose(): void {
		if (dismissible) {
			onClose();
		}
	}
	const direction = SWIPE[presentation];
	const swipe = useSwipeDismiss(panelRef, direction ?? "down", requestClose);

	useEffect(() => {
		const dialog = dialogRef.current;
		unmountingRef.current = false;
		dialog?.showModal();
		return (): void => {
			unmountingRef.current = true;
			dialog?.close();
		};
	}, []);

	return createPortal(
		<dialog
			ref={dialogRef}
			{...(typeof labelledBy === "string" && { "aria-labelledby": labelledBy })}
			{...(typeof label === "string" && { "aria-label": label })}
			{...(typeof describedBy === "string" && { "aria-describedby": describedBy })}
			className={cn(
				"fixed inset-0 m-0 flex size-full max-h-none max-w-none bg-transparent p-0 text-text outline-none",
				"backdrop:bg-scrim backdrop:backdrop-blur-[2px] backdrop:animate-[fade-in_0.2s_ease-out]",
				CONTAINER[presentation],
			)}
			onCancel={(ev) => {
				ev.preventDefault();
				requestClose();
			}}
			onClose={(ev) => {
				// Browser forced close (repeated Escape): keep React in sync.
				// Ignore the async event of our own close() when the dialog
				// was reopened since (StrictMode effect replay).
				if (!unmountingRef.current && !ev.currentTarget.open) {
					onClose();
				}
			}}
			onPointerDown={(ev) => {
				pressedBackdropRef.current = ev.target === ev.currentTarget;
			}}
			onClick={(ev) => {
				if (pressedBackdropRef.current && ev.target === ev.currentTarget) {
					requestClose();
				}
				pressedBackdropRef.current = false;
			}}
		>
			<div
				ref={panelRef}
				{...(direction && presentation !== "sheet" && swipe)}
				className={cn(
					"flex flex-col overflow-hidden overscroll-contain border-border bg-surface font-main shadow-ui-lg",
					presentation === "center" && "border",
					PANEL[presentation],
					className,
				)}
			>
				{presentation === "sheet" && (
					<div
						{...swipe}
						aria-hidden
						className="flex shrink-0 touch-none justify-center pt-2.5 pb-1 cursor-grab"
					>
						<span className="h-1.5 w-10 rounded-full bg-border2" />
					</div>
				)}
				{children}
			</div>
		</dialog>,
		document.body,
	);
}

/** Title row with close button, shared by modals, sheets and drawers */
export function DialogHeader({
	titleId,
	title,
	subtitleId,
	subtitle,
	onClose,
	leading,
	className,
}: {
	titleId: string;
	title: ReactNode;
	subtitleId?: string;
	subtitle?: ReactNode;
	onClose?: () => void;
	leading?: ReactNode;
	className?: string;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();

	return (
		<header className={cn("flex shrink-0 items-start gap-3 px-5 pt-4 pb-3 md:px-6 md:pt-5", className)}>
			{leading}
			<div className="min-w-0 flex-1 self-center">
				<h2
					id={titleId}
					className="font-head text-ui-lg font-semibold tracking-tight text-text md:text-ui-xl"
				>
					{title}
				</h2>
				{Boolean(subtitle) && (
					<p id={subtitleId} className="mt-0.5 text-ui-sm text-text2">
						{subtitle}
					</p>
				)}
			</div>
			{onClose && (
				<IconButton
					icon={PiX}
					label={t("common.close")}
					tooltip={false}
					onClick={onClose}
					className="-mr-2 -mt-0.5 rounded-full"
				/>
			)}
		</header>
	);
}

/** Bottom sheet on every screen size (action lists, pickers) */
export function Sheet({
	title,
	label,
	onClose,
	children,
	className,
}: {
	title?: ReactNode;
	/** Accessible name when there is no title */
	label?: string;
	onClose: () => void;
	children: ReactNode;
	className?: string;
}): JSX.Element {
	const titleId = useId();
	const hasTitle = Boolean(title);

	return (
		<DialogRoot
			presentation="sheet"
			onClose={onClose}
			{...(hasTitle ? { labelledBy: titleId } : { label })}
		>
			{hasTitle && (
				<DialogHeader titleId={titleId} title={title} className="pt-1" />
			)}
			<div className={cn("overflow-y-auto px-2 pb-3", className)}>
				{children}
			</div>
		</DialogRoot>
	);
}

/** Side panel sliding from an edge */
export function Drawer({
	side = "end",
	title,
	label,
	onClose,
	children,
	className,
}: {
	side?: "start" | "end";
	title?: ReactNode;
	label?: string;
	onClose: () => void;
	children: ReactNode;
	className?: string;
}): JSX.Element {
	const titleId = useId();
	const hasTitle = Boolean(title);

	return (
		<DialogRoot
			presentation={side === "start" ? "drawer-start" : "drawer-end"}
			onClose={onClose}
			className={cn(side === "start" && "bg-back2")}
			{...(hasTitle ? { labelledBy: titleId } : { label })}
		>
			{hasTitle && (
				<DialogHeader titleId={titleId} title={title} onClose={onClose} />
			)}
			<div className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto", className)}>
				{children}
			</div>
		</DialogRoot>
	);
}
