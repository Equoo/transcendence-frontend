import type { JSX } from "react/jsx-runtime";

import type { Role } from "@/admin/api/roles";

import LineInfo from "./LineInfo";

export interface LineInfos {
	name: string;
	value?: string;
	action?: () => void;
}

export default function Section({
	title,
	lines,
	role,
}: {
	title: string;
	lines: LineInfos[];
	role: Role;
}): JSX.Element {
	return (
		<div className="text-text w-full flex flex-col gap-5 ">
			<h1 className="text-xl font-bold text-muted">{title}</h1>
			<div className="flex flex-col gap-3">
				{lines.map((line) => (
					<LineInfo
						key={line.name}
						name={line.name}
						value={line.value}
						action={line.action}
                        role={role}
					></LineInfo>
				))}
			</div>
			<div className=" border-border2"></div>
		</div>
	);
}
