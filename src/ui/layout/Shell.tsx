import {
	createContext,
	type JSX,
	type ReactNode,
	use,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import { PiSidebarSimple } from "react-icons/pi";
import { useLocation } from "react-router";

import { cn } from "../lib/cn";
import { useBreakpoint } from "../lib/useBreakpoint";
import { ensureTouchActive } from "../lib/useLongPress";
import { Drawer } from "../overlay/Dialog";
import { IconButton } from "../primitives/IconButton";

/** full: labelled sidebar · rail: icons only (tablet) · drawer: hidden, opened on demand (phone) */
export type NavMode = "full" | "rail" | "drawer";

interface ShellContextValue {
	navMode: NavMode;
	openNav: () => void;
	closeNav: () => void;
}

const ShellContext = createContext<ShellContextValue>({
	navMode: "full",
	openNav: () => {
		// Outside a shell: nothing to open
	},
	closeNav: () => {
		// Outside a shell: nothing to close
	},
});
ShellContext.displayName = "ShellContext";

export function useShell(): ShellContextValue {
	return use(ShellContext);
}

/**
 * App frame. Desktop: sidebar + main + optional aside column.
 * Tablet: icon rail (expandable) + main, aside as a drawer.
 * Phone: main only, sidebar and aside as drawers.
 */
export function AppShell({
	nav,
	aside,
	asideLabel,
	asideOpen = false,
	onAsideOpenChange,
	children,
}: {
	/** Usually a <SidePanel> of <NavItem>s */
	nav: ReactNode;
	/** Right panel (members, thread, assistant…) */
	aside?: ReactNode;
	asideLabel?: string;
	asideOpen?: boolean;
	onAsideOpenChange?: (open: boolean) => void;
	children: ReactNode;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const { isPhone, isDesktop } = useBreakpoint();
	const { pathname } = useLocation();
	const navMode: NavMode = isDesktop ? "full" : isPhone ? "drawer" : "rail";
	// The drawer belongs to the page + layout it was opened on:
	// navigating or resizing closes it without an effect
	const navKey = `${navMode}:${pathname}`;
	const [openedOn, setOpenedOn] = useState<string | null>(null);
	const navOpen = openedOn === navKey;

	const ctx = useMemo<ShellContextValue>(
		() => ({
			navMode,
			openNav: (): void => {
				setOpenedOn(navKey);
			},
			closeNav: (): void => {
				setOpenedOn(null);
			},
		}),
		[navMode, navKey],
	);
	const drawerCtx = useMemo<ShellContextValue>(
		() => ({ ...ctx, navMode: "full" }),
		[ctx],
	);

	useEffect(ensureTouchActive, []);

	const hasAside = Boolean(aside) && asideOpen;

	return (
		<ShellContext value={ctx}>
			<div className="flex h-dvh w-full overflow-hidden bg-back font-main text-text">
				<a
					href="#main"
					className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-70 focus:rounded-full focus:bg-surface focus:px-4 focus:py-2 focus:shadow-ui-md"
				>
					{t("ui.skipToContent")}
				</a>

				{navMode !== "drawer" && (
					<nav
						aria-label={t("ui.navigation")}
						className={cn(
							"flex h-full shrink-0 flex-col border-r border-border bg-back2",
							navMode === "full" ? "w-side" : "w-rail items-center",
						)}
					>
						{navMode === "rail" && (
							<IconButton
								icon={PiSidebarSimple}
								label={t("ui.expandMenu")}
								tooltipSide="right"
								onClick={ctx.openNav}
								className="mt-3"
							/>
						)}
						{nav}
					</nav>
				)}

				<main
					id="main"
					tabIndex={-1}
					className="relative flex min-w-0 flex-1 flex-col overflow-y-auto outline-none"
				>
					{children}
				</main>

				{hasAside && isDesktop && (
					<aside
						aria-label={asideLabel}
						className="flex h-full w-aside shrink-0 flex-col overflow-hidden border-l border-border bg-surface"
					>
						{aside}
					</aside>
				)}
			</div>

			{navOpen && navMode !== "full" && (
				<ShellContext value={drawerCtx}>
					<Drawer side="start" label={t("ui.navigation")} onClose={ctx.closeNav}>
						<nav aria-label={t("ui.navigation")} className="flex min-h-0 flex-1 flex-col">
							{nav}
						</nav>
					</Drawer>
				</ShellContext>
			)}

			{hasAside && !isDesktop && (
				<Drawer
					side="end"
					{...(typeof asideLabel === "string" && { label: asideLabel })}
					onClose={() => {
						onAsideOpenChange?.(false);
					}}
				>
					{aside}
				</Drawer>
			)}
		</ShellContext>
	);
}
