import type { ComponentProps, JSX } from "react";
import type { IconType } from "react-icons";

import Tooltip from "@/components/Tooltip";

type Props = ComponentProps<"button"> & {
	active?: boolean;
	discrete?: boolean;
	activeCheck?: boolean;
	icon: IconType;
	size?: number;
	pending?: boolean;
	danger?: boolean;
	tooltip?: string;
};

export default function IconBtn({
	active = false,
	discrete = false,
	icon: Icon,
	size = 18,
	danger = false,
	tooltip,
	title,
	...rest
}: Props): JSX.Element {
	const label = tooltip ?? title ?? rest["aria-label"];
	const activeStyle =
		"text-accent-text bg-accent hover:brightness-110 active:translate-y-[1px] shadow-accent hover:shadow-xs disabled:bg-muted disabled:hover:brightness-100";
	const unactiveStyle =
		"text-text bg-surface border border-border hover:bg-border";
	const discreteStyle = "text-text2 hover:bg-border hover:border-border";
	const dangerStyle = "text-red-400 hover:bg-border hover:border-border";
	const button = (
		<button
			type="button"
			aria-label={label}
			{...rest}
			aria-pressed={active}
			className={`${active ? activeStyle : discrete ? discreteStyle : danger ? dangerStyle : unactiveStyle} inline-flex items-center font-semibold duration-150 py-2.5 px-2.5 gap-2 rounded-[12px] cursor-pointer ${rest.className}`}
		>
			<Icon size={size} />
		</button>
	);

	if (typeof label === "undefined") {
		return button;
	}
	return (
		<Tooltip content={label} focusable={false} className="inline-flex shrink-0">
			{button}
		</Tooltip>
	);
}
