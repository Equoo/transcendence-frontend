import { type RefObject, useEffect } from "react";

export function useClickOutside(
	ref: RefObject<HTMLElement | null>,
	onClickOutside: () => void,
): void {
	useEffect(() => {
		function handleClick(event: MouseEvent): void {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				onClickOutside();
			}
		}

		document.addEventListener("mousedown", handleClick);
		return (): void => {
			document.removeEventListener("mousedown", handleClick);
		};
	}, [ref, onClickOutside]);
}
