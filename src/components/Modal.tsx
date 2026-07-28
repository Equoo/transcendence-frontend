import type { JSX, ReactNode } from "react";
import { useSearchParams } from "react-router";

export default function Modal({
	children,
	title,
	name,
}: {
	children: ReactNode;
	title: string;
	name: string;
}): JSX.Element {
	const [, setSearchParams] = useSearchParams();
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
			<div className="bg-surface2 rounded-lg shadow-xl w-full max-w-lg px-6 py-4 animate-in m-4">
				<div className="flex justify-center items-center mb-4">
					<h2 className="text-xl font-semibold font-main absolute">
						{title}
					</h2>
					<button
						type="button"
						className="text-muted hover:text-text text-3xl cursor-pointer ml-auto"
						onClick={() => {
							setSearchParams(
								(sp) => {
									sp.delete(name);
									return sp;
								},
								{ defaultShouldRevalidate: false },
							);
						}}
					>
						×
					</button>
				</div>
				<div className="flex flex-col items-center gap-6 mt-8">
					{children}
				</div>
			</div>
		</div>
	);
}
