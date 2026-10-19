import type { JSX, ReactNode } from "react";
import type { IconType } from "react-icons";
import { PiCaretRight } from "react-icons/pi";
import { Link } from "react-router";

export default function DashboardPanel({
	icon: Icon,
	title,
	to,
	linkLabel,
	children,
}: {
	icon: IconType;
	title: string;
	to?: string;
	linkLabel?: string;
	children: ReactNode;
}): JSX.Element {
	return (
		<section className="flex flex-col gap-3 p-4 rounded-base border border-border bg-surface">
			<div className="flex items-center gap-2">
				<Icon size={18} className="text-muted" />
				<h2 className="font-head font-semibold text-[15px] text-text">{title}</h2>
				<span className="flex-1" />
				{to && (
					<Link
						to={to}
						className="inline-flex items-center gap-0.5 text-[13px] font-semibold text-text2 hover:text-accent duration-120"
					>
						{linkLabel}
						<PiCaretRight size={12} />
					</Link>
				)}
			</div>
			{children}
		</section>
	);
}
