import type { JSX } from "react";

const dotDelays = [
	"[animation-delay:0ms]",
	"[animation-delay:150ms]",
	"[animation-delay:300ms]",
];

export default function HydratingScreen(): JSX.Element {
	return (
		<div
			role="status"
			aria-live="polite"
			className="relative flex items-center justify-center w-full h-full overflow-hidden bg-back font-main"
		>
			<div className="absolute -top-32 -left-32 size-96 rounded-full bg-accent-soft blur-3xl opacity-70" />
			<div className="absolute -bottom-40 -right-24 size-112 rounded-full bg-back2 blur-3xl" />

			<div className="relative z-10 flex flex-col items-center gap-6 px-12 py-10 rounded-2xl bg-surface border border-border shadow-main animate-in">
				<div className="relative">
					<span className="absolute inset-0 rounded-2xl bg-accent/25 animate-ping [animation-duration:2s]" />
					<img
						src="/logo/icon-tile.svg"
						alt=""
						className="relative size-16"
					/>
				</div>

				<div className="flex flex-col items-center gap-1">
					<h1 className="text-3xl font-semibold font-head text-text tracking-tight">
						Keep Grouped<span className="text-accent">.</span>
					</h1>
					<p className="text-sm text-muted">
						Getting your group ready
					</p>
				</div>

				<div className="flex gap-1.5" aria-hidden>
					{dotDelays.map((delay) => (
						<span
							key={delay}
							className={`size-2 rounded-full bg-accent animate-bounce ${delay}`}
						/>
					))}
				</div>
				<span className="sr-only">Loading…</span>
			</div>
		</div>
	);
}
