import type { JSX, ReactNode } from "react";

export default function Modal({
	children,
	title,
	onClose,
	align = "center",
}: {
	children: ReactNode;
	title: string;
	onClose: () => void;
	align?: string;
}): JSX.Element {
	return (
		<div className="fixed w-screen inset-0 z-50 flex items-center justify-center bg-black/60">
			<div className="bg-surface2 rounded-lg shadow-xl w-fit max-w-lg px-6 py-4 animate-in m-4">
				<div className="flex items-center mb-4">
					<h2 className="text-xl font-semibold font-main">{title}</h2>
					<button
						type="button"
						className="text-muted hover:text-text text-3xl cursor-pointer ml-auto pl-4"
						onClick={onClose}
					>
						×
					</button>
				</div>
				<div className={`flex flex-col items-${align} gap-6 mt-8`}>
					{children}
				</div>
			</div>
		</div>
	);
}
