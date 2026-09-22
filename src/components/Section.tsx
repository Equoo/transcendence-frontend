import type { JSX } from "react/jsx-runtime";

import LineInfo from "./LineInfo";

export interface LineInfos {
	name: string;
	value?: string;
	action?: () => void;
}

export default function Section({
	title,
	lines,
}: {
	title: string;
	lines: LineInfos[];
}): JSX.Element {
	return (
		<div className="text-text w-full flex flex-col gap-5 border-b border-border2 ">
			<h1 className="text-xl font-bold text-muted">{title}</h1>
			<div className="flex flex-col">
				{lines.map((line) => (
					<LineInfo
						key={line.name}
						name={line.name}
						value={line.value}
						action={line.action}
					></LineInfo>
				))}
			</div>
		</div>
	);
}
