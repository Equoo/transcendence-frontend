import type { JSX } from "react";

export default function AdminBox({
	name,
	value,
}: {
	name: string;
	value: number;
}): JSX.Element {
	return (
		<div className="flex gap-5 items-center">
			<h1 className="text-2xl">{name}</h1>
			<input
				className="w-5 h-5"
				type="checkbox"
				value={value}
				name={name}
			></input>
		</div>
	);
}

export function RolesBox({
	perm,
	enumPerm,
}: {
	perm: number;
	enumPerm: number;
}): JSX.Element {
	if ((perm | enumPerm) === enumPerm) {
		return (
			<div className="w-30">
				<input type="checkbox" defaultChecked></input>
			</div>
		);
	}
	return (
		<div className="w-30">
			<input type="checkbox"></input>
		</div>
	);
}
