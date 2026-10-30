import type { JSX } from "react";

export default function HiddenValues({
	name,
	values,
}: {
	name: string;
	values: string[];
}): JSX.Element {
	return (
		<>
			{values.map((val) => (
				<input hidden key={val} name={name} value={val} readOnly />
			))}
		</>
	);
}
