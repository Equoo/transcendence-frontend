import type { JSX } from "react";

export default function AdminBox({ name }: { name: string }): JSX.Element {
	return (
		<div className="flex">
			<h1>{name}</h1>
			<input type="checkbox" name={name}></input>
		</div>
	);
}
