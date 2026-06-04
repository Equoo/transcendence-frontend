import type { JSX, ReactNode } from "react";

export default function EventBadge({
	children,
}: {
	children: ReactNode;
}): JSX.Element {
	return (
		<span
			className="inline-flex items-center gap-2 bg-surface border rounded-full border-border2 px-2 py-1
				font-semibold text-xs"
		>
			{children}
		</span>
	);
}
