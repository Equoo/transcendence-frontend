import type { JSX } from "react";

export default function AdminBox({ name }: { name: string }): JSX.Element {
	return (
		<div className="flex gap-5 items-center">
			<h1 className="text-2xl">{name}</h1>
			<input className="w-5 h-5" type="checkbox" name={name}></input>
		</div>
	);
}
