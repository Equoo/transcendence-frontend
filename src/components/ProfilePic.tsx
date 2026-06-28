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
			className={`z-${idx} place-content-center bg-accent border-2 rounded-full w-8 h-8 text-white font-semibold text-center`}
		>
			{name.at(0)?.toUpperCase()}
		</div>
	);
}
