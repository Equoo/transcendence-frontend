import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge our custom tokens (see ui/theme.css) so that
// `cn("text-ui-sm", "text-ui-lg")` keeps the last one and does not
// mistake `text-ui-sm` for a color.
const twMerge = extendTailwindMerge({
	extend: {
		theme: {
			text: [
				"ui-2xs",
				"ui-xs",
				"ui-sm",
				"ui-base",
				"ui-md",
				"ui-lg",
				"ui-xl",
				"ui-2xl",
				"ui-3xl",
			],
			radius: ["ui-xs", "ui-sm", "ui-md", "ui-lg"],
			shadow: ["ui-sm", "ui-md", "ui-lg", "main"],
			spacing: ["ctl-sm", "ctl-md", "ctl-lg", "side", "rail", "aside"],
			animate: [
				"in",
				"pop",
				"nudge",
				"sheet-in",
				"drawer-start-in",
				"drawer-end-in",
				"dialog-in",
			],
		},
	},
});

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
