import type { ComponentProps, JSX } from "react";
import { PiCheckFatFill } from "react-icons/pi";
import { TbLoader2 } from "react-icons/tb";

type Props = ComponentProps<"button"> & {
	active?: boolean;
	discrete?: boolean;
	activeCheck?: boolean;
	pending?: boolean;
};

export default function CheckButton({
	children,
	active = false,
	discrete = false,
	activeCheck = true,
	type = "button",
	pending = false,
	...rest
}: Props): JSX.Element {
	const activeStyle =
		"text-accent-text bg-accent hover:brightness-110 rounded-full border border-accent shadow-accent hover:shadow-xs";
	const unactiveStyle =
		"text-text bg-surface border border-border hover:bg-border";
	const discreteStyle =
		"text-text2 hover:bg-border border border-surface hover:border-border";
	return (
		<div className={rest.className}>
			<button
				type={type}
				{...rest}
				aria-pressed={active}
				className={`${active ? activeStyle : discrete ? discreteStyle : unactiveStyle} inline-flex items-center font-semibold duration-150 py-2 px-4 gap-2 rounded-full cursor-pointer`}
			>
				{pending && <TbLoader2 className="animate-spin" />}
				{active && activeCheck && !pending && <PiCheckFatFill />}
				{children}
			</button>
		</div>
	);
}
