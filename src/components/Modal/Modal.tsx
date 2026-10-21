import {
	type AnimationEventHandler,
	type JSX,
	type ReactNode,
	useEffect,
	useEffectEvent,
	useId,
	useRef,
} from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { PiX } from "react-icons/pi";

import { FieldErrors } from "../Input/Field";

export type ModalSize = "sm" | "md" | "lg" | "page";

const CARD_WIDTH: Record<Exclude<ModalSize, "page">, string> = {
	sm: "max-w-sm",
	md: "max-w-md",
	lg: "max-w-lg",
};

const openModals: symbol[] = [];

export function panelClass(highlight = false): string {
	return `rounded-3xl border bg-surface shadow-main duration-300 ${
		highlight ? "border-accent/40 ring-4 ring-accent/10" : "border-border"
	}`;
}

export function CloseButton({
	onClick,
	className = "",
}: {
	onClick: () => void;
	className?: string;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();

	return (
		<button
			type="button"
			aria-label={t("common.close")}
			className={`flex items-center justify-center size-9 shrink-0 rounded-full text-text2 duration-150 cursor-pointer hover:bg-hover hover:text-text ${className}`}
			onClick={onClick}
		>
			<PiX size={18} />
		</button>
	);
}

function ModalHeader({
	titleId,
	subtitleId,
	title,
	subtitle,
	onClose,
}: {
	titleId: string;
	subtitleId: string;
	title: string;
	subtitle?: ReactNode;
	onClose: () => void;
}): JSX.Element {
	return (
		<header className="flex items-start gap-4">
			<div className="flex-1 min-w-0">
				<h2
					id={titleId}
					className="font-head font-semibold text-xl text-text tracking-tight"
				>
					{title}
				</h2>
				{subtitle && (
					<p id={subtitleId} className="text-sm text-text2">
						{subtitle}
					</p>
				)}
			</div>
			<CloseButton onClick={onClose} className="-mr-2 -mt-1" />
		</header>
	);
}

export function ModalFooter({
	errors,
	children,
}: {
	errors?: string[];
	children: ReactNode;
}): JSX.Element {
	return (
		<footer className="flex flex-col gap-3 border-t border-border pt-4">
			<FieldErrors errors={errors} />
			{children}
		</footer>
	);
}

export function ModalActions({
	children,
}: {
	children: ReactNode;
}): JSX.Element {
	return <div className="flex gap-3 *:flex-1">{children}</div>;
}

export default function Modal({
	title,
	subtitle,
	onClose,
	size = "md",
	highlight = false,
	className = "",
	onAnimationEnd,
	children,
}: {
	title: string;
	subtitle?: ReactNode;
	onClose: () => void;
	size?: ModalSize;
	highlight?: boolean;
	className?: string;
	onAnimationEnd?: AnimationEventHandler;
	children: ReactNode;
}): JSX.Element {
	const titleId = useId();
	const subtitleId = useId();
	const panelRef = useRef<HTMLDivElement>(null);
	const close = useEffectEvent(onClose);
	const page = size === "page";

	useEffect(() => {
		const token = Symbol("modal");
		openModals.push(token);

		if (!panelRef.current?.contains(document.activeElement)) {
			panelRef.current?.focus({ preventScroll: true });
		}

		function onKeyDown(ev: KeyboardEvent): void {
			if (
				ev.key === "Escape" &&
				!ev.defaultPrevented &&
				openModals.at(-1) === token
			) {
				ev.preventDefault();
				close();
			}
		}

		document.addEventListener("keydown", onKeyDown);
		return (): void => {
			document.removeEventListener("keydown", onKeyDown);
			openModals.splice(openModals.indexOf(token), 1);
		};
	}, []);

	const header = (
		<ModalHeader
			titleId={titleId}
			subtitleId={subtitleId}
			title={title}
			subtitle={subtitle}
			onClose={onClose}
		/>
	);

	return createPortal(
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
			{...(Boolean(subtitle) && { "aria-describedby": subtitleId })}
			className={`fixed inset-0 z-50 overflow-y-auto bg-back/85 backdrop-blur-md animate-[fade-in_0.2s_ease-out] ${page ? "" : "flex p-4"}`}
			onAnimationEnd={onAnimationEnd}
			onDragOver={(ev) => {
				ev.preventDefault();
			}}
			onDrop={(ev) => {
				ev.preventDefault();
			}}
		>
			{page ? (
				<div
					ref={panelRef}
					tabIndex={-1}
					className={`focus-visible:outline-0 ${className}`}
				>
					<div className="sticky top-0 z-30 not-sm:bg-back/85 not-sm:backdrop-blur-md px-4 py-4 sm:px-8">
						{header}
					</div>
					{children}
				</div>
			) : (
				<div
					ref={panelRef}
					tabIndex={-1}
					className={`m-auto flex w-full ${CARD_WIDTH[size]} flex-col gap-4 p-5 animate-in focus-visible:outline-0 sm:p-7 ${panelClass(highlight)} ${className}`}
				>
					{header}
					{children}
				</div>
			)}
		</div>,
		document.body,
	);
}
