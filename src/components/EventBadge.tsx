import type { JSX, ReactNode } from "react";

export default function EventBadge({
	children,
	border = "border border-border2",
	text = "text-text2",
	bg = "bg-transparent",
}: {
	children: ReactNode;
	border?: string;
	text?: string;
	bg?: string;
}): JSX.Element {
	return (
		<span
			className={`inline-flex items-center gap-2 rounded-full px-2 py-1
				font-semibold text-xs ${border} ${text} ${bg}`}
		>
			{children}
		</span>
	);
}
