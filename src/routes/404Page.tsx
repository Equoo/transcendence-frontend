import type { JSX } from "react";

export default function Page404(): JSX.Element {
	return (
		<div className="w-full h-full flex justify-center items-center bg-back2">
			<h1 className="absolute z-1 text-accent-text mb-50 text-[150px] font-bold">
				Page not found.
			</h1>
		</div>
	);
}
