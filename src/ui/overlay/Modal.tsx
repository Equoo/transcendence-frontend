import { type JSX, type ReactNode, useId, useState } from "react";
import { useTranslation } from "react-i18next";

import { FieldErrors } from "../form/Field";
import { cn } from "../lib/cn";
import { useBreakpoint } from "../lib/useBreakpoint";
import { Button } from "../primitives/Button";
import { DialogHeader, type DialogPresentation, DialogRoot } from "./Dialog";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

const WIDTH: Record<Exclude<ModalSize, "full">, string> = {
	sm: "max-w-sm",
	md: "max-w-md",
	lg: "max-w-lg",
	xl: "max-w-3xl",
};

/**
 * Responsive modal: centered card from md up, bottom sheet (or
 * fullscreen) on phones. Mount to open, unmount to close.
 */
export function Modal({
	title,
	subtitle,
	onClose,
	size = "md",
	phone = "sheet",
	footer,
	dismissible = true,
	highlight = false,
	className,
	children,
}: {
	title: ReactNode;
	subtitle?: ReactNode;
	onClose: () => void;
	size?: ModalSize;
	/** Presentation on phones */
	phone?: "sheet" | "fullscreen";
	/** Sticky bottom area, usually <ModalActions> */
	footer?: ReactNode;
	dismissible?: boolean;
	highlight?: boolean;
	className?: string;
	children: ReactNode;
}): JSX.Element {
	const titleId = useId();
	const subtitleId = useId();
	const { isPhone } = useBreakpoint();
	const presentation: DialogPresentation =
		size === "full" ? "fullscreen" : isPhone ? phone : "center";

	return (
		<DialogRoot
			presentation={presentation}
			onClose={onClose}
			labelledBy={titleId}
			{...(Boolean(subtitle) && { describedBy: subtitleId })}
			dismissible={dismissible}
			className={cn(
				presentation === "center" && size !== "full" && WIDTH[size],
				highlight && "border-accent/40 ring-4 ring-accent/10",
			)}
		>
			<DialogHeader
				titleId={titleId}
				title={title}
				subtitleId={subtitleId}
				subtitle={subtitle}
				{...(dismissible && { onClose })}
				className={cn(presentation === "sheet" && "pt-1")}
			/>
			<div
				className={cn(
					"min-h-0 flex-1 overflow-y-auto px-5 pb-5 md:px-6",
					Boolean(footer) && "pb-4",
					className,
				)}
			>
				{children}
			</div>
			{Boolean(footer) && (
				<footer className="shrink-0 border-t border-border px-5 py-4 md:px-6">
					{footer}
				</footer>
			)}
		</DialogRoot>
	);
}

/** Footer buttons: stacked full width on phones, right-aligned row above */
export function ModalActions({
	errors,
	children,
	className,
}: {
	errors?: string[];
	children: ReactNode;
	className?: string;
}): JSX.Element {
	return (
		<div className="flex flex-col gap-3">
			<FieldErrors errors={errors} />
			<div
				className={cn(
					"flex flex-col-reverse gap-2 *:w-full sm:flex-row sm:justify-end sm:*:w-auto",
					className,
				)}
			>
				{children}
			</div>
		</div>
	);
}

/** Yes / no question. `onConfirm` may return a promise: the button spins meanwhile. */
export function ConfirmDialog({
	title,
	message,
	confirmLabel,
	cancelLabel,
	danger = false,
	onConfirm,
	onClose,
}: {
	title: ReactNode;
	message?: ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	danger?: boolean;
	onConfirm: () => unknown;
	onClose: () => void;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [pending, setPending] = useState(false);
	const [errors, setErrors] = useState<string[]>([]);

	async function confirm(): Promise<void> {
		setPending(true);
		setErrors([]);
		try {
			await onConfirm();
			onClose();
		} catch (err) {
			setErrors([err instanceof Error ? err.message : String(err)]);
		} finally {
			setPending(false);
		}
	}

	return (
		<Modal
			title={title}
			size="sm"
			onClose={onClose}
			dismissible={!pending}
			footer={
				<ModalActions errors={errors}>
					<Button variant="ghost" disabled={pending} onClick={onClose}>
						{cancelLabel ?? t("common.cancel")}
					</Button>
					<Button
						variant={danger ? "danger" : "primary"}
						loading={pending}
						onClick={() => {
							void confirm();
						}}
					>
						{confirmLabel ?? t("common.confirm")}
					</Button>
				</ModalActions>
			}
		>
			{Boolean(message) && (
				<p className="text-ui-base text-text2">{message}</p>
			)}
		</Modal>
	);
}
