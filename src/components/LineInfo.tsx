import type { JSX } from "react";
import { TbPencil } from "react-icons/tb";

export default function LineInfo({
	name,
	value,
	action,
}: {
	name: string;
	value?: string;
	action?: () => void;
}): JSX.Element {
	return (
		<div className="flex justify-between w-full h-10">
			<div className="flex justify-center">
				<h1 className="">{name}</h1>
			</div>
			<div className="flex gap-5 h-5 justify-center items-center">
				{value && <h1>{value}</h1>}
				<TbPencil
					onClick={() => {
						action;
					}}
					size={20}
					className="hover:text-text text-text2 hover:cursor-pointer"
				></TbPencil>
			</div>
		</div>
	);
}
