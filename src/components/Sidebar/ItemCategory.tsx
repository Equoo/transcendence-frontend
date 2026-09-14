import type { JSX, ReactNode } from "react";
import type { IconType } from "react-icons";
import { TbLoader2 } from "react-icons/tb";
import { NavLink } from "react-router";

function ItemCategory({
	children,
	icon: Icon,
	to,
}: {
	children: ReactNode;
	icon: IconType;
	to: string;
}): JSX.Element {

	return (
		<li>
			<NavLink
				to={to}
				end={to === "/"}
				className={({ isActive }) =>
					[
						"flex items-center px-2 py-1.5 text-[14.5px] rounded-base group duration-120",
						isActive
							? "bg-accent-soft text-text"
							: "hover:bg-hover hover:text-text",
					].join(" ")
				}
			>
				{({ isActive, isPending }) => (
					<>
						{isPending ? (
							<TbLoader2 className="animate-spin min-w-5" />
						) : (
							<Icon
								className="min-w-5"
								size={18}
								color={isActive ? "#e8743c" : ""}
							/>
						)}
						<span className="ms-3">{children}</span>
					</>
				)}
			</NavLink>
		</li>
	);
}

export default ItemCategory;
