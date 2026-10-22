import type { JSX, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PiArrowLeft, PiList } from "react-icons/pi";
import { useNavigate } from "react-router";

import { cn } from "../lib/cn";
import { IconButton } from "../primitives/IconButton";
import { useShell } from "./Shell";

export type PageWidth = "narrow" | "default" | "wide" | "full";

const WIDTH: Record<PageWidth, string> = {
	narrow: "max-w-2xl",
	default: "max-w-5xl",
	wide: "max-w-[1180px]",
	full: "max-w-none",
};

/**
 * Top bar of a page: title, subtitle, actions. Shows a back button
 * when `back` is set, otherwise the menu button on phones.
 */
export function PageHeader({
	title,
	subtitle,
	leading,
	actions,
	back,
	sticky = true,
	className,
}: {
	title: ReactNode;
	subtitle?: ReactNode;
	/** Icon / avatar before the title */
	leading?: ReactNode;
	actions?: ReactNode;
	/** Path, or callback, for the back button */
	back?: string | (() => void);
	sticky?: boolean;
	className?: string;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { navMode, openNav } = useShell();

	return (
		<header
			className={cn(
				"z-20 flex min-h-16 shrink-0 items-center gap-2 border-b border-border px-3 py-2.5 md:gap-3 md:px-6",
				sticky && "sticky top-0 bg-back/85 backdrop-blur-md",
				className,
			)}
		>
			{typeof back === "undefined" ? (
				navMode === "drawer" && (
					<IconButton icon={PiList} label={t("ui.openMenu")} tooltip={false} onClick={openNav} />
				)
			) : (
				<IconButton
					icon={PiArrowLeft}
					label={t("ui.back")}
					onClick={() => {
						if (typeof back === "string") {
							void navigate(back);
						} else {
							back();
						}
					}}
				/>
			)}
			{leading}
			<div className="min-w-0 flex-1">
				<h1 className="truncate font-head text-ui-lg font-semibold tracking-tight text-text md:text-ui-xl">
					{title}
				</h1>
				{typeof subtitle !== "undefined" && (
					<p className="truncate text-ui-sm text-text2">{subtitle}</p>
				)}
			</div>
			{typeof actions !== "undefined" && (
				<div className="flex shrink-0 items-center gap-1.5 md:gap-2">{actions}</div>
			)}
		</header>
	);
}

/** Page frame: optional header + centered content with standard gutters */
export function Page({
	header,
	width = "default",
	padded = true,
	className,
	children,
}: {
	header?: ReactNode;
	width?: PageWidth;
	/** false for edge-to-edge content (chat, calendar grid) */
	padded?: boolean;
	className?: string;
	children: ReactNode;
}): JSX.Element {
	return (
		<>
			{header}
			<div
				className={cn(
					"mx-auto flex w-full flex-1 flex-col",
					WIDTH[width],
					padded && "gap-5 px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:gap-6 md:px-6 md:py-6",
					className,
				)}
			>
				{children}
			</div>
		</>
	);
}
