import type { JSX } from "react";

export default function Alert({
	title,
	detail,
}: {
	title: string;
	detail?: string;
}): JSX.Element {
	return (
		<div className="flex flex-col">
			<div className="font-main font-semibold text-md">{title}</div>
			{detail && (
				<div className="text-sm font-main text-text2">{detail}</div>
			)}
		</div>
	);
}
