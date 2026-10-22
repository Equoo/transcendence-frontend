import "blobatar/motion.css";

import { Blobatar } from "@blobatar/react";
import { type Expression, idle, sleepy, surprised } from "blobatar/expression";
import { type JSX, type ReactNode, useState } from "react";

import { cn } from "../lib/cn";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type Presence = "online" | "busy" | "afk" | "offline";

const SIZES: Record<AvatarSize, string> = {
	xs: "size-6",
	sm: "size-8",
	md: "size-10",
	lg: "size-14",
	xl: "size-20",
};

const PRESENCE: Record<Presence, string> = {
	online: "bg-good",
	busy: "bg-error",
	afk: "bg-warn",
	offline: "bg-muted",
};

// The blob buddy reacts to its owner's presence
const EXPRESSION: Record<Presence, Expression> = {
	online: surprised,
	busy: idle,
	afk: sleepy,
	offline: sleepy,
};

/**
 * User picture, or the user's Blobatar buddy when there is none.
 * The presence dot ring takes `--avatar-ring` (default: surface) so
 * it blends with any background.
 */
export function Avatar({
	name,
	seed,
	src,
	fallback,
	size = "md",
	presence,
	presenceLabel,
	animate = "always",
	className,
}: {
	/** Display name, used as alt text */
	name: string;
	/** Stable blob seed (user id); defaults to the name */
	seed?: string;
	src?: string | null;
	/** Custom content instead of the blob */
	fallback?: ReactNode;
	size?: AvatarSize;
	presence?: Presence;
	presenceLabel?: string;
	/** Blob animation: always, on hover, or static (long lists) */
	animate?: "always" | "hover" | "none";
	className?: string;
}): JSX.Element {
	const [failedSrc, setFailedSrc] = useState<string | null>(null);
	const showImage = Boolean(src) && failedSrc !== src;
	const blobSeed = seed ?? name;
	const expression = EXPRESSION[presence ?? "online"];

	function content(): ReactNode {
		if (showImage) {
			return (
				<img
					src={src ?? ""}
					alt={name}
					draggable={false}
					onError={() => {
						setFailedSrc(src ?? null);
					}}
					className="size-full rounded-full object-cover"
				/>
			);
		}
		if (typeof fallback !== "undefined") {
			return fallback;
		}
		return animate === "none" ? (
			<Blobatar name={blobSeed} expression={expression} alt={name} draggable={false} className="size-full" />
		) : (
			<Blobatar name={blobSeed} expression={expression} animate={animate} role="img" aria-label={name} className="size-full" />
		);
	}

	return (
		<span className={cn("relative inline-grid shrink-0 place-items-center rounded-full select-none", SIZES[size], className)}>
			{content()}
			{presence && (
				<span
					role="status"
					aria-label={presenceLabel ?? presence}
					className={cn(
						"absolute -right-px -bottom-px size-[34%] min-h-2.5 min-w-2.5 rounded-full ring-[2.5px] ring-[var(--avatar-ring,var(--color-surface))]",
						PRESENCE[presence],
					)}
				/>
			)}
		</span>
	);
}

/** Overlapping avatars with a "+N" bubble */
export function AvatarGroup({
	people,
	max = 4,
	size = "sm",
	className,
}: {
	people: { name: string; seed?: string; src?: string | null }[];
	max?: number;
	size?: AvatarSize;
	className?: string;
}): JSX.Element {
	const shown = people.slice(0, max);
	const extra = people.length - shown.length;

	return (
		<span className={cn("flex items-center -space-x-2", className)}>
			{shown.map((person) => (
				<Avatar
					key={person.seed ?? person.name}
					name={person.name}
					seed={person.seed}
					src={person.src}
					size={size}
					animate="hover"
					className="rounded-full bg-surface ring-[2.5px] ring-surface"
				/>
			))}
			{extra > 0 && (
				<span
					className={cn(
						"inline-grid shrink-0 place-items-center rounded-full border border-dashed border-border2 bg-surface2 font-main text-ui-2xs font-bold text-text2 ring-[2.5px] ring-surface",
						SIZES[size],
					)}
				>
					+{extra}
				</span>
			)}
		</span>
	);
}
