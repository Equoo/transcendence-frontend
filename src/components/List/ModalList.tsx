import type { JSX, ReactNode } from "react";

export function ModalList({
	message,
	className = "max-h-80",
	children,
}: {
	message?: ReactNode;
	className?: string;
	children?: ReactNode;
}): JSX.Element {
	return (
		<ul
			className={`-mx-2 flex flex-col gap-0.5 overflow-y-auto ${className}`}
		>
			{message && (
				<li className="py-4 text-center text-sm text-muted">
					{message}
				</li>
			)}
			{children}
		</ul>
	);
}

export function ModalListItem({
	onClick,
	selected,
	children,
}: {
	onClick?: () => void;
	selected?: boolean;
	children: ReactNode;
}): JSX.Element {
	const className = `flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm text-text duration-150
		${selected === true ? "bg-accent-soft" : "hover:bg-hover"}`;

	return (
		<li>
			{onClick ? (
				<button
					type="button"
					aria-pressed={selected}
					className={`${className} cursor-pointer`}
					onClick={onClick}
				>
					{children}
				</button>
			) : (
				<div className={className}>{children}</div>
			)}
		</li>
	);
}
