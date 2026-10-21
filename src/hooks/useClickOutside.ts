import { type RefObject, useEffect } from "react";

export function useClickOutside<T extends HTMLElement>(
	ref: RefObject<T | null>,
	onClickOutside: () => void,
): RefObject<T | null> {
	useEffect(() => {
		function handleClick(event: MouseEvent): void {
			const target = event.target as Node;
			if (!ref.current || ref.current.contains(target)) {
				return;
			}
			const dialog =
				target instanceof Element
					? target.closest('[role="dialog"]')
					: null;
			if (dialog && !dialog.contains(ref.current)) {
				return;
			}
			onClickOutside();
		}

		document.addEventListener("mousedown", handleClick);
		return (): void => {
			document.removeEventListener("mousedown", handleClick);
		};
	}, [ref, onClickOutside]);

	return ref;
}
