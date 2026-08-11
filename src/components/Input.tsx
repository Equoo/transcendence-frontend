import type { ComponentProps, JSX, ReactNode } from "react";
import type { ValidationErrors } from "../api/problem_detail";
import { Field } from "./Field";

export type InputProps = ComponentProps<"input"> & {
	name: string;
	className?: string;
	children?: ReactNode;
	errors?: ValidationErrors;
};

export function Input({
	name,
	errors,
	className,
	children,
	...rest
}: InputProps): JSX.Element {
	const isError = Boolean(errors?.[name] ?? false);

	return (
		<Field name={name} required={rest.required} errors={errors}>
			<div
				className={`relative flex flex-wrap items-center w-full bg-surface border rounded-md
                    px-2 py-1 font-main text-text
                    ${isError ? "border-error" : "border-border2 focus-within:border-accent"} ${className}`}
			>
				{children}
				<input
					className={`bg-transparent outline-0 ring-0 border-0 p-0 w-10 grow peer`}
					name={name}
					{...rest}
				/>
			</div>
		</Field>
	);
}
