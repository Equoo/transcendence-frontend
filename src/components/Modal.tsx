import type { JSX, ReactNode } from "react";
import { Form } from "react-router";

export default function Modal({
	children,
	title,
}: {
	children: ReactNode;
	title: string;
}): JSX.Element {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
			<div className="bg-surface rounded-lg shadow-xl  w-full max-w-lg px-6 py-4 animate-in m-4">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold font-main">{title}</h2>
					<Form>
						<button
							type="submit"
							className="text-muted hover:text-text text-3xl cursor-pointer"
							name=""
						>
							×
						</button>
					</Form>
				</div>
				<div className="flex flex-col items-center gap-6 mt-8">
					{children}
				</div>
			</div>
		</div>
	);
}
