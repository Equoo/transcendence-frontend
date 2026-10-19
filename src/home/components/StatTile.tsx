import type { JSX, ReactNode } from "react";
import type { IconType } from "react-icons";
import { Link } from "react-router";

export function StatTileSkeleton(): JSX.Element {
	return (
		<div className="flex items-center gap-3 p-4 rounded-base border border-border bg-surface animate-pulse">
			<div className="size-11 shrink-0 rounded-2xl bg-border" />
			<div className="flex flex-col gap-2">
				<div className="h-6 w-10 rounded bg-border" />
				<div className="h-3 w-24 rounded bg-border" />
			</div>
		</div>
	);
}

export default function StatTile({
	icon: Icon,
	label,
	value,
	to,
	highlight = false,
}: {
	icon: IconType;
	label: string;
	value: ReactNode;
	to: string;
	highlight?: boolean;
}): JSX.Element {
	return (
		<Link
			to={to}
			className={[
				"flex items-center gap-3 p-4 rounded-base border hover:-translate-y-0.5 hover:shadow-main duration-120",
				highlight ? "border-accent/30 bg-accent-soft" : "border-border bg-surface",
			].join(" ")}
		>
			<div className={`flex items-center justify-center size-11 shrink-0 rounded-2xl ${highlight ? "bg-accent text-accent-text" : "bg-accent-soft text-accent"}`}>
				<Icon size={22} />
			</div>
			<div className="flex flex-col min-w-0">
				<span className="font-head font-bold text-2xl text-text tabular-nums leading-tight">{value}</span>
				<span className="text-[13px] text-text2 truncate">{label}</span>
			</div>
		</Link>
	);
}
