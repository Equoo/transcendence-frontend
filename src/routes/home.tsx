import type { JSX } from "react";

export default function Home(): JSX.Element {
	return (
		<div className="bg-surface flex flex-col max-w-lg gap-4 p-8 border border-border rounded-3xl shadow-main">
			<h5 className="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">
				Tactical Strike
			</h5>
			<p className="text-body mb-6">
				Here are the biggest technology acquisitions of 2025 so far, in
				reverse chronological order.
			</p>
			<div className="inline-flex flex-row gap-2.5">
				<a
					href="#"
					className="inline-flex items-center text-accent-text bg-accent box-border border border-transparent
					hover:brightness-110 focus:ring-4 focus:ring-brand-mediumshadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
				>
					I'm here
				</a>
				<a
					href="#"
					className="inline-flex items-center text-text bg-surface box-border border border-transparent
					hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
				>
					Maybe
				</a>
			</div>
		</div>
	);
}
