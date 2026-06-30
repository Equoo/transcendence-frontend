import type { JSX } from "react";

export default function ProfilePic({
	name,
	idx = 1,
}: {
	name: string;
	idx?: number;
}): JSX.Element {
	return (
		<div
			className={`z-${idx} place-content-center bg-accent border-2 rounded-full min-w-8 min-h-8 text-white font-semibold text-center`}
		>
			{name.at(0)?.toUpperCase()}
		</div>
	);
}
