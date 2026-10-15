import type { JSX, ReactNode } from "react";

export default function Badge({
	children,
	border = "border border-border2",
	text = "text-text2",
	bg = "bg-transparent",
	className = "",
}: {
	children: ReactNode;
	border?: string;
	text?: string;
	bg?: string;
	className?: string;
}): JSX.Element {
	return (
		<span
			className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-2 py-1
				font-semibold text-xs [&>svg]:shrink-0 ${border} ${text} ${bg} ${className}`}
		>
			{children}
		</span>
	);
}
