import type { JSX } from "react";
import { TbPencil } from "react-icons/tb";

import type { Role } from "@/admin/api/roles";

export default function LineInfo({
	name,
	value,
	action,
	role,
}: {
	name: string;
	value?: string;
	action?: () => void;
	role: Role;
}): JSX.Element {
	return (
		<div className="flex justify-between gap-3 w-full h-10 ">
			<div className="flex shrink-0">
				<h1 className="whitespace-nowrap">{name}</h1>
			</div>
			<div className="flex h-5 min-w-0 justify-center gap-2 items-center ">
				{value && (
					<h1 className="text-[11px] truncate whitespace-nowrap">
						{value}
					</h1>
				)}
				{action && role.name !== "\\(*-*)/" && (
					<div className="shrink-0">
						<TbPencil
							onClick={action}
							size={20}
							className=" hover:text-text text-text2 hover:cursor-pointer"
						></TbPencil>
					</div>
				)}
			</div>
		</div>
	);
}
