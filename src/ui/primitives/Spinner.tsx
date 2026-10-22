import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { TbLoader2 } from "react-icons/tb";

import { cn } from "../lib/cn";

export function Spinner({
	size = 18,
	label,
	className,
}: {
	size?: number;
	/** Announced to screen readers; omit when the parent already says it is busy */
	label?: string;
	className?: string;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();

	const a11y =
		label === ""
			? { "aria-hidden": true }
			: { role: "status", "aria-label": label ?? t("common.loading") };

	return (
		<TbLoader2
			size={size}
			{...a11y}
			className={cn("shrink-0 animate-spin", className)}
		/>
	);
}
