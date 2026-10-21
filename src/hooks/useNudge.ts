import { type AnimationEvent, useState } from "react";

export function useNudge<T extends string>(): {
	nudged: T | null;
	nudge: (target: T) => void;
	onAnimationEnd: (ev: AnimationEvent) => void;
} {
	const [nudged, setNudged] = useState<T | null>(null);

	return {
		nudged,
		nudge: setNudged,
		onAnimationEnd: (ev): void => {
			if (ev.animationName === "nudge") {
				setNudged(null);
			}
		},
	};
}
