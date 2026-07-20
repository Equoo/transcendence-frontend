import type { ComponentProps, JSX, ReactNode } from "react";
import type { ValidationErrors } from "../api/problem_detail";

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
				<input
					className={`bg-transparent outline-0 ring-0 border-0 p-0 w-10 grow peer`}
					name={name}
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
