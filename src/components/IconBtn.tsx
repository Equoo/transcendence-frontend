import type { ComponentProps, JSX } from "react";
import type { IconType } from "react-icons/pi";
import { TbLoader2 } from "react-icons/tb";

type Props = ComponentProps<"button"> & {
	active?: boolean;
	discrete?: boolean;
	activeCheck?: boolean;
	icon: IconType;
	size?: number;
	pending?: boolean;
};

export default function IconBtn({
	active = false,
	discrete = false,
	activeCheck = true,
	icon: Icon,
	size = 18,
	pending = false,
	...rest
}: Props): JSX.Element {
	const activeStyle =
		"text-accent-text bg-accent hover:brightness-110 active:translate-y-[1px] shadow-accent hover:shadow-xs disabled:bg-muted disabled:hover:brightness-100";
	const unactiveStyle =
		"text-text bg-surface border border-border hover:bg-border";
	const discreteStyle =
		"text-text2 hover:bg-border hover:border-border";
	return (
		<button
			{...rest}
			aria-pressed={active}
			className={`${active ? activeStyle : discrete ? discreteStyle : unactiveStyle} inline-flex items-center font-semibold duration-150 py-2.5 px-2.5 gap-2 rounded-[12px] cursor-pointer`}
		>
			<Icon size={size} />
		</button>
	);
}
