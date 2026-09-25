import type { JSX, ReactNode } from "react";

export default function Modal({
	children,
	title,
	onClose,
	width = "w-7/10",
	align = "center",
}: {
	children: ReactNode;
	title: string;
	onClose: () => void;
	width?: string;
	align?: string;
}): JSX.Element {
	return (
		<div className="fixed w-screen inset-0 z-50 flex items-center justify-center bg-black/60">
			<div
				className={`bg-surface2 rounded-lg shadow-xl ${width} max-w-lg px-6 py-4 animate-in m-4`}
			>
				<div className="flex items-center mb-4 justify-between">
					<div className="opacity-0 text-3xl pl-4">×</div>
					<h2 className="text-xl text-text font-semibold font-main">
						{title}
					</h2>
					<button
						type="button"
						className="text-muted hover:text-text text-3xl cursor-pointer pl-4"
						onClick={onClose}
					>
						×
					</button>
				</div>
				<div className={`flex flex-col items-${align} gap-6 mt-2`}>
					{children}
				</div>
			</div>
		</div>
	);
}
