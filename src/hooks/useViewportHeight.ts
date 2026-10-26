import { useEffect } from "react";

/**
 * Exposes the visible viewport height as `--app-height` so the app shrinks
 * above the virtual keyboard. Android handles it with the `interactive-widget`
 * viewport hint, but iOS Safari keeps the layout viewport full height.
 */
export function useViewportHeight(): void {
	useEffect(() => {
		const viewport = window.visualViewport;
		const root = document.documentElement;

		function update(): void {
			if (!viewport) {
				return;
			}
			root.style.setProperty("--app-height", `${viewport.height}px`);
			// iOS scrolls the whole page to reveal the focused field
			window.scrollTo(0, 0);
		}

		update();
		viewport?.addEventListener("resize", update);
		return (): void => {
			viewport?.removeEventListener("resize", update);
			root.style.removeProperty("--app-height");
		};
	}, []);
}
