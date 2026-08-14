import type { JSX, ReactNode } from "react";
import type { ValidationErrors } from "../api/problem_detail";

export function Field({
	name,
	required,
	errors,
	className,
	children,
}: {
	name: string;
	required?: boolean;
	errors?: ValidationErrors;
	className?: string;
	children: ReactNode;
}): JSX.Element {
	return (
		<div className={`inline-flex flex-col w-full ${className ?? ""}`}>
			<div className="text-red-500">
				<label className="text-text font-main font-medium">
					{name}
				</label>
				{(required ?? false) && "*"}
			</div>
			{children}
			{errors?.[name]?.map((err) => (
				<p className="ml-1 text-error text-xs tracking-wide" key={err}>
					- {err}
				</p>
			))}
		</div>
	);
}
