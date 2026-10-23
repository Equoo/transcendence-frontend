import type { JSX, ReactNode } from "react";
import type { IconType } from "react-icons";
import { TbLoader2 } from "react-icons/tb";
import { NavLink, useLocation } from "react-router";

import { useLongPress } from "@/hooks/useLongPress";

function MenuLi({
	to,
	icon: Icon,
	children,
}: {
	to: string;
	icon?: IconType;
	children: ReactNode;
}): JSX.Element {
	const location = useLocation();
	const active = location.pathname === to;

	const longPressEvent = useLongPress(() => {
		console.log("feur");
	});

	let className =
		"relative flex itemscenter px-2 py-1 text-[14.5px] rounded-base group duration-120 cursor-pointer active:bg-blue-600 touch-manipulation";
	className += active
		? " bg-accent-soft text-text"
		: " hover:bg-hover hover:text-text";

	return (
		<li className={className}>
			<NavLink
				to={to}
				className="after:absolute after:inset-0"
				{...longPressEvent}
			>
				{(props) => (
					<>
						{props.isPending ? (
							<TbLoader2 className="animate-spin min-w-5 shrink-0" />
						) : (
							Icon && <Icon></Icon>
						)}
						{children}
					</>
				)}
			</NavLink>
		</li>
	);
}

export default MenuLi;
