import { type JSX, type ReactNode, useState } from "react";
import type { IconType } from "react-icons";
import { NavLink } from "react-router";

function ItemCategorie({
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
						"flex items-center px-2 py-1.5 rounded-base group duration-120",
						isActive
							? "bg-accent-soft text-text"
							: "text-muted hover:bg-hover hover:text-text",
					].join(" ")
				}
			>
				{({ isActive }) => (
					<>
						<Icon size={18} color={isActive ? "#e8743c" : ""} />
						<span className="ms-3">{children}</span>
					</>
				)}
			</NavLink>
		</li>
	);
}

export default ItemCategorie;
