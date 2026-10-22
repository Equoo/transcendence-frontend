import type { ComponentProps, JSX } from "react";

import { cn } from "../lib/cn";
import { controlClass, useFieldControl } from "./Field";

/**
 * Multi-line input. `autoGrow` sizes it to its content between
 * `rows` and `maxRows` (CSS field-sizing, falls back to fixed rows).
 */
export function TextArea({
	invalid,
	autoGrow = false,
	maxRows = 10,
	rows = 3,
	id,
	required,
	className,
	style,
	...rest
}: ComponentProps<"textarea"> & {
	invalid?: boolean;
	autoGrow?: boolean;
	maxRows?: number;
}): JSX.Element {
	const control = useFieldControl({ id, invalid, required });

	return (
		<textarea
			rows={rows}
			{...control}
			{...rest}
			style={{
				...style,
				...(autoGrow && {
					minHeight: `calc(${rows}lh + 1rem)`,
					maxHeight: `calc(${maxRows}lh + 1rem)`,
				}),
			}}
			className={controlClass({
				invalid: control["aria-invalid"],
				className: cn(
					"block resize-y py-2 leading-normal",
					autoGrow && "resize-none [field-sizing:content]",
					className,
				),
			})}
		/>
	);
}
