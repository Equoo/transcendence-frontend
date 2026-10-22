import { useMediaQuery } from "@/hooks/useMediaQuery";

// Mirrors Tailwind's md / lg breakpoints.
// phone < 768 <= tablet < 1024 <= desktop
export const MEDIA = {
	tablet: "(min-width: 768px)",
	desktop: "(min-width: 1024px)",
	touch: "(pointer: coarse)",
} as const;

export interface Breakpoint {
	isPhone: boolean;
	isTablet: boolean;
	isDesktop: boolean;
	isTouch: boolean;
}

export function useBreakpoint(): Breakpoint {
	const atLeastTablet = useMediaQuery(MEDIA.tablet);
	const isDesktop = useMediaQuery(MEDIA.desktop);
	const isTouch = useMediaQuery(MEDIA.touch);

	return {
		isPhone: !atLeastTablet,
		isTablet: atLeastTablet && !isDesktop,
		isDesktop,
		isTouch,
	};
}
