import type { ComponentProps, JSX } from "react";
import { PiCheckFatFill } from "react-icons/pi";
import { TbLoader2 } from "react-icons/tb";

type Props = ComponentProps<"button"> & {
	active?: boolean;
	discrete?: boolean;
	activeCheck?: boolean;
	danger?: boolean;
	pending?: boolean;
};

export default function CheckButton({
	children,
	active = false,
	discrete = false,
	activeCheck = true,
	danger = false,
	type = "button",
	pending = false,
	...rest
}: Props): JSX.Element {
	let style = "inline-flex items-center font-semibold duration-150 justify-center w-full py-2 px-4 gap-2 rounded-full cursor-pointer disabled:bg-muted disabled:hover:brightness-100";

	if (active) {
		style += " text-accent-text hover:brightness-110 rounded-full active:translate-y-[1px] shadow-accent hover:shadow-xs";
		if (danger) {
			style += " bg-error";
		} else {
			style += " bg-accent";
		}
	} else if (discrete) {
		style += " text-text2 hover:bg-border border border-surface hover:border-border";
	} else {
		style += " text-text bg-surface border border-border";
		if (danger) {
			style += " hover:bg-error-soft";
		} else {
			style += " hover:bg-border";
		}
	}
	return (
		<div className={rest.className}>
			<button
				type={type}
				{...rest}
				disabled={pending}
				aria-pressed={active}
				className={style}
			>
				{pending && <TbLoader2 className="animate-spin" />}
				{active && activeCheck && !pending && <PiCheckFatFill />}
				{children}
			</button>
		</div>
	);
}
