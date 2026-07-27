import type { JSX } from "react";

export default function ProfilePic({
	name,
	size = 8,
	idx = 1,
}: {
	name: string;
	size?: number;
	idx?: number;
}): JSX.Element {
	return (
		<div
			className={`z-${idx} place-content-center bg-accent border-2 rounded-full min-w-8 min-h-8 text-white font-semibold text-center`}
			style={{minWidth: `calc(var(--spacing) * ${size})`, minHeight: `calc(var(--spacing) * ${size})`}}
		>
			{name.at(0)?.toUpperCase()}
		</div>
	);
}
