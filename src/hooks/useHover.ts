import { useState } from "react";

export type HoverProps = Pick<
	React.HTMLAttributes<HTMLElement>,
	"onMouseEnter" | "onMouseLeave"
>;

export function useHover(): [boolean, HoverProps] {
	const [isHovered, setIsHovered] = useState(false);

	const handleMouseEnter = (): void => {
		setIsHovered(true);
	};
	const handleMouseLeave = (): void => {
		setIsHovered(false);
	};

	return [
		isHovered,
		{
			onMouseEnter: handleMouseEnter,
			onMouseLeave: handleMouseLeave,
		},
	];
}
