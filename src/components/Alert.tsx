import type { JSX } from "react";
import type { ToastContentProps } from "react-toastify";

export default function Alert({
	data,
}: ToastContentProps<{
	title: string;
	detail?: string;
}>): JSX.Element {
	return (
		<div className="flex flex-col">
			<div className="font-main font-semibold text-md mr-4">
				{data.title}
			</div>
			<div className="text-sm font-main">{data.detail}</div>
		</div>
	);
}
