import type { ComponentProps, JSX, ReactNode } from "react";

type Alignment = "text-left" | "text-center" | "text-right";

export interface ListColumn {
	id: string;
	pos?: Alignment;
	className?: string;
}

export function ListRow({
	className = "",
	...props
}: ComponentProps<"tr">): JSX.Element {
	return (
		<tr
			{...props}
			className={`border-b border-border last:border-b-0 ${className}`}
		/>
	);
}

export function ListCell({
	pos = "text-left",
	rowHeader = false,
	className = "",
	...props
}: ComponentProps<"td"> & {
	pos?: Alignment;
	rowHeader?: boolean;
}): JSX.Element {
	return rowHeader ? (
		<th
			{...props}
			scope="row"
			className={`px-6 py-4 align-middle font-medium ${pos} ${className}`}
		/>
	) : (
		<td
			{...props}
			className={`px-6 py-4 align-middle  ${pos} ${className}`}
		/>
	);
}

export function ListActions({
	className = "",
	...props
}: ComponentProps<"div">): JSX.Element {
	return (
		<div
			{...props}
			className={`flex flex-wrap items-center justify-end gap-3 ${className}`}
		/>
	);
}

export function ListAction({
	className = "",
	type = "button",
	...props
}: ComponentProps<"button">): JSX.Element {
	return (
		<button
			{...props}
			type={type}
			className={`inline-flex items-center justify-center rounded-sm p-1 text-text2 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
		/>
	);
}

type ListProps = ComponentProps<"table"> & {
	cols: ListColumn[];
	empty?: boolean;
	emptyMessage?: ReactNode;
};

export default function List({
	cols,
	children,
	empty = false,
	emptyMessage = "Nothing to display.",
	className = "",
	...props
}: ListProps): JSX.Element {
	return (
		<div className="w-full min-w-0 overflow-x-auto rounded-base border border-border bg-surface">
			<table
				{...props}
				className={`w-full text-sm font-main text-text ${className}`}
			>
				<thead className="border-b border-border text-text">
					<tr>
						{cols.map((col) => (
							<th
								key={col.id}
								scope="col"
								className={`px-6 py-3 font-medium ${col.pos ?? "text-left"} ${col.className}`}
							>
								{col.id}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{empty ? (
						<ListRow>
							<ListCell
								colSpan={cols.length}
								pos="text-center"
								className="text-muted"
							>
								{emptyMessage}
							</ListCell>
						</ListRow>
					) : (
						children
					)}
				</tbody>
			</table>
		</div>
	);
}
