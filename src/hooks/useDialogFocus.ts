import { type RefObject, useEffect, useEffectEvent, useState } from "react";

import {
	focusInOtherDialog,
	initialFocus,
	restoreFocus,
	trapFocus,
} from "@/utils/focus.util";

export function useDialogFocus<T extends HTMLElement>(
	ref: RefObject<T | null>,
	onClose: () => void,
): void {
	const close = useEffectEvent(onClose);
	const [opener] = useState(() => document.activeElement);

	useEffect(() => {
		if (ref.current) {
			initialFocus(ref.current).focus({ preventScroll: true });
		}

		function onKeyDown(ev: KeyboardEvent): void {
			const root = ref.current;
			if (ev.defaultPrevented || !root) {
				return;
			}
			if (ev.key === "Escape" && !focusInOtherDialog(root)) {
				ev.preventDefault();
				close();
			} else {
				trapFocus(ev, root);
			}
		}

		document.addEventListener("keydown", onKeyDown);
		return (): void => {
			document.removeEventListener("keydown", onKeyDown);
			restoreFocus(opener);
		};
	}, [ref, opener]);
}
