import {
	useEffect,
	useState,
	type ComponentProps,
	type JSX,
	type ReactNode,
} from "react";
import type { ValidationErrors } from "../api/problem_detail";

export type InputProps = ComponentProps<"textarea"> & {
	name: string;
	className?: string;
	children?: ReactNode;
	errors?: ValidationErrors;
};

export function TextArea({
	name,
	errors,
	className,
	children,
	value,
	...rest
}: InputProps): JSX.Element {
	const isError = Boolean(errors?.[name] ?? false);
	const [internalValue, setInternalValue] = useState(value ?? "");

	useEffect(() => {
		if (value) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setInternalValue(value);
		}
	}, [value]);

	return (
		<div className="inline-flex flex-col w-full">
			<div className="text-red-500">
				<label className="text-text font-main font-medium">
					{name}
				</label>
				{(rest.required ?? false) && "*"}
			</div>
			<div
				className={`relative flex flex-wrap items-center w-full bg-surface border rounded-md
                    px-2 py-1 font-main text-text
                    ${isError ? "border-error" : "border-border2 focus-within:border-accent"} ${className}`}
			>
				{children}
				<textarea
					name={name}
					className={`bg-transparent outline-0 ring-0 border-0 p-0 w-10 grow peer`}
					value={internalValue}
					onChange={(ev) => {
						setInternalValue(ev.target.value);
					}}
					{...rest}
				/>
			</div>
			{errors?.[name]?.map((err) => (
				<p className="ml-1 text-error text-xs tracking-wide " key={err}>
					- {err}
				</p>
			))}
		</div>
	);
}
