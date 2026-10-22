import { type JSX, useState } from "react";

import { cn } from "../lib/cn";
import { useFieldControl } from "./Field";

/** On / off toggle. Controlled with `checked`, or uncontrolled with `defaultChecked`. */
export function Switch({
	checked,
	defaultChecked = false,
	onCheckedChange,
	name,
	disabled = false,
	id,
	label,
	className,
}: {
	checked?: boolean;
	defaultChecked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	/** Submits "on" / "off" with forms */
	name?: string;
	disabled?: boolean;
	id?: string;
	/** Accessible name when not inside a <Field> */
	label?: string;
	className?: string;
}): JSX.Element {
	const [inner, setInner] = useState(defaultChecked);
	const isOn = checked ?? inner;
	const control = useFieldControl({ id });

	return (
		<>
			{Boolean(name) && (
				<input type="hidden" name={name} value={isOn ? "on" : "off"} />
			)}
			<button
				type="button"
				role="switch"
				aria-checked={isOn}
				{...(Boolean(label) && { "aria-label": label })}
				{...control}
				disabled={disabled}
				onClick={() => {
					setInner(!isOn);
					onCheckedChange?.(!isOn);
				}}
				className={cn(
					"tap group relative inline-flex h-6.5 w-11 shrink-0 items-center rounded-full border border-transparent p-0.5 cursor-pointer transition-colors duration-200",
					"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50",
					// Touch: 44px hit area
					"pointer-coarse:after:absolute pointer-coarse:after:-inset-2.5",
					isOn ? "bg-accent" : "bg-border2",
					className,
				)}
			>
				<span
					aria-hidden
					className={cn(
						"block h-5 w-5 rounded-full bg-surface shadow-ui-sm transition-[translate,width] duration-200 group-active:w-6",
						isOn && "translate-x-4.5 group-active:translate-x-3.5",
					)}
				/>
			</button>
		</>
	);
}
