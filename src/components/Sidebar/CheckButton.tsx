import type { JSX, ReactNode } from "react";

export default function CheckButton({
	children,
	active = false,
	discrete = false,
}: {
	children: ReactNode;
	active?: boolean;
	discrete?: boolean;
}): JSX.Element {
	const activeStyle =
		"text-accent-text bg-accent hover:brightness-110 rounded-full shadow-accent hover:shadow-xs";
	const unactiveStyle =
		"text-text bg-surface border border-border hover:bg-border";
	const discreteStyle =
		"text-text2 hover:bg-border border border-surface hover:border-border";
	return (
		<button
			type="button"
			className={`inline-flex items-center font-semibold duration-150 py-2 px-4 gap-2 rounded-full cursor-pointer 
				${active ? activeStyle : discrete ? discreteStyle : unactiveStyle}`}
		>
			{children}
		</button>
	);
}
