import type { JSX, ReactNode } from "react";

export default function List({
	children,
	headers,
}: {
	children: ReactNode;
	headers: string[];
}): JSX.Element {
	return (
		<table className="w-full text-sm font-main text-left text-text">
			<thead className="text-sm text-body bg-surface border-b rounded-base border-border">
				<tr>
					{headers.map((head) => (
						<th
							scope="col"
							className="px-6 py-3 font-semibold text-lg"
							key={head}
						>
							{head}
						</th>
					))}
				</tr>
			</thead>
			<tbody>{children}</tbody>
		</table>
	);
}
