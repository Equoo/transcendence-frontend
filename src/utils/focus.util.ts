const FOCUSABLE = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled]):not([type=hidden])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex='-1'])",
].join(",");

export function focusableIn(root: HTMLElement): HTMLElement[] {
	return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
		(el) => el.getClientRects().length > 0,
	);
}

export function initialFocus(root: HTMLElement): HTMLElement {
	const items = focusableIn(root);

	return (
		items.find(
			(el) =>
				el.matches("input, select, textarea") && !el.closest("header"),
		) ??
		items.at(0) ??
		root
	);
}

export function focusInOtherDialog(root: HTMLElement): boolean {
	const dialog = document.activeElement?.closest("[role=dialog]");
	return Boolean(dialog && !dialog.contains(root));
}

export function trapFocus(ev: KeyboardEvent, root: HTMLElement): void {
	if (ev.key !== "Tab") {
		return;
	}

	const active = document.activeElement;
	if (focusInOtherDialog(root)) {
		return;
	}

	const items = focusableIn(root);
	const first = items.at(0);
	const last = items.at(-1);

	if (!first || !last) {
		ev.preventDefault();
		root.focus();
	} else if (!root.contains(active)) {
		ev.preventDefault();
		(ev.shiftKey ? last : first).focus();
	} else if (ev.shiftKey && (active === first || active === root)) {
		ev.preventDefault();
		last.focus();
	} else if (!ev.shiftKey && active === last) {
		ev.preventDefault();
		first.focus();
	}
}

export function restoreFocus(element: Element | null): void {
	if (element instanceof HTMLElement && element.isConnected) {
		element.focus({ preventScroll: true });
	}
}
