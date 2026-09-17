import { type RefObject, useEffect } from "react";

export function useClickOutside<T extends HTMLElement>(
	ref: RefObject<T | null>,
	onClickOutside: () => void,
): RefObject<T | null> {
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

	return ref;
}
