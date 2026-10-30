import {
	type ComponentProps,
	type JSX,
	type ReactNode,
	useEffect,
	useId,
	useState,
} from "react";

import type { ValidationErrors } from "../../api/problem_detail";
import { Field, fieldBox } from "./Field";
import { BARE_INPUT } from "./Slot";

export type InputProps = ComponentProps<"textarea"> & {
	name: string;
	label?: string;
	className?: string;
	children?: ReactNode;
	errors?: ValidationErrors;
};

export function TextArea({
	name,
	label,
	errors,
	className = "",
	children,
	value,
	...rest
}: InputProps): JSX.Element {
	const generatedId = useId();
	const [internalValue, setInternalValue] = useState(value ?? "");

	useEffect(() => {
		// eslint-disable-next-line @eslint-react/set-state-in-effect
		setInternalValue(value ?? "");
	}, [value]);

	return (
		<Field
			name={name}
			label={label}
			htmlFor={rest.id ?? generatedId}
			required={rest.required}
			errors={errors}
		>
			<div
				className={`relative flex items-start gap-2 ${fieldBox({
					error: Boolean(errors?.[name]),
				})} ${className}`}
			>
				{children}
				<textarea
					id={generatedId}
					name={name}
					className={`${BARE_INPUT} min-w-0 grow resize-none field-sizing-content min-h-16 text-sm leading-relaxed`}
					value={internalValue}
					onChange={(ev) => {
						setInternalValue(ev.target.value);
					}}
					{...rest}
				/>
			</div>
		</Field>
	);
}
