import type { JSX, ReactNode } from "react";

export default function List({
	children,
	headers,
}: {
	children: ReactNode;
	headers: string[];
}): JSX.Element {
	return (
		<div className="w-full rounded bg-surface  border-border">
			<table className="w-full">
				<thead className="text-body border-b border-border ">
					<tr>
						{headers.map((head) => (
							<th
								scope="col"
								className="first:text-left  py-3 px-6 font-semibold text-lg text-center"
								key={head}
							>
								{head}
							</th>
						))}
					</tr>
				</thead>
				<tbody>{children}</tbody>
			</table>
		</div>
	);
}
