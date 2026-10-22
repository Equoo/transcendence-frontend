import type { JSX, ReactNode } from "react";
import type { IconType } from "react-icons";

import { cn } from "../lib/cn";

/** Loading placeholder. Size it with className (h-4 w-32…). */
export function Skeleton({
	shape = "line",
	className,
}: {
	shape?: "line" | "circle" | "rect";
	className?: string;
}): JSX.Element {
	return (
		<span
			aria-hidden
			className={cn(
				"ui-skeleton block",
				shape === "line" && "h-3.5 w-full rounded-full",
				shape === "circle" && "size-10 rounded-full",
				shape === "rect" && "h-24 w-full rounded-ui-md",
				className,
			)}
		/>
	);
}

/** Placeholder for empty lists, missing pages, errors */
export function EmptyState({
	icon: Icon,
	title,
	description,
	action,
	compact = false,
	className,
}: {
	icon?: IconType;
	title: ReactNode;
	description?: ReactNode;
	action?: ReactNode;
	compact?: boolean;
	className?: string;
}): JSX.Element {
	return (
		<div
			className={cn(
				"mx-auto flex max-w-sm flex-col items-center text-center",
				compact ? "gap-2 py-6" : "gap-3 py-12",
				className,
			)}
		>
			{Icon && (
				<span
					className={cn(
						"mb-1 grid place-items-center rounded-full bg-accent-soft text-accent",
						compact ? "size-10" : "size-14",
					)}
				>
					<Icon size={compact ? 20 : 26} aria-hidden />
				</span>
			)}
			<h3
				className={cn(
					"font-head font-semibold tracking-tight text-text",
					compact ? "text-ui-md" : "text-ui-lg",
				)}
			>
				{title}
			</h3>
			{typeof description !== "undefined" && (
				<p className="text-ui-sm text-text2">{description}</p>
			)}
			{typeof action !== "undefined" && <div className="mt-2">{action}</div>}
		</div>
	);
}
