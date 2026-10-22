import { type JSX, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiChatCircleDots, PiUsersThree, PiX } from "react-icons/pi";

import { Search } from "../form/Input";
import { cn } from "../lib/cn";
import { type PressPoint, useLongPress } from "../lib/useLongPress";
import { ContextMenu, type MenuEntry } from "../overlay/Menu";
import { Avatar, type Presence } from "../primitives/Avatar";
import { EmptyState, Skeleton } from "../primitives/Feedback";
import { IconButton } from "../primitives/IconButton";

export interface Member {
	id: string;
	name: string;
	avatarSrc?: string | null;
	presence: Presence;
	role?: { name: string; color?: string };
	/** Custom status line ("Raiding tonight 🔥") */
	status?: string;
	isSelf?: boolean;
}

const GROUPS: [Presence, string][] = [
	["online", "home.status.online"],
	["busy", "home.status.busy"],
	["afk", "home.status.away"],
	["offline", "home.status.offline"],
];

function MemberRow({
	member,
	onSelect,
	onMessage,
	actions,
}: {
	member: Member;
	onSelect?: (member: Member) => void;
	onMessage?: (member: Member) => void;
	actions?: MenuEntry[];
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [menuAt, setMenuAt] = useState<PressPoint | null>(null);
	const [row, setRow] = useState<HTMLButtonElement | null>(null);
	const hasActions = Boolean(actions?.length);
	const press = useLongPress(setMenuAt, { disabled: !hasActions });
	const closeMenu = useCallback(() => {
		setMenuAt(null);
	}, []);
	const offline = member.presence === "offline";

	return (
		<li className="group relative">
			<button
				ref={setRow}
				type="button"
				onClick={() => {
					onSelect?.(member);
				}}
				{...press}
				{...(hasActions && { "aria-haspopup": "menu" as const })}
				className={cn(
					"tap hold-fill no-callout flex w-full items-center gap-3 rounded-ui-sm px-2 py-1.5 text-left cursor-pointer",
					"transition-[background-color,scale,opacity] duration-120 hover:bg-hover active:scale-[.98] active:bg-border",
					"focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
					offline && "opacity-55 hover:opacity-100",
					Boolean(onMessage) && member.isSelf !== true && "pointer-fine:pr-11",
				)}
			>
				<Avatar
					name={member.name}
					seed={member.id}
					src={member.avatarSrc}
					presence={member.presence}
					presenceLabel={t(GROUPS.find(([key]) => key === member.presence)?.[1] ?? "")}
					animate="hover"
				/>
				<span className="min-w-0 flex-1">
					<span className="flex items-center gap-1.5">
						<span
							className="truncate text-ui-base font-semibold text-text"
							{...(typeof member.role?.color === "string" && { style: { color: member.role.color } })}
						>
							{member.name}
						</span>
						{member.isSelf === true && <span className="shrink-0 text-ui-xs text-muted">{t("home.you")}</span>}
					</span>
					{Boolean(member.status ?? member.role) && (
						<span className="block truncate text-ui-xs text-muted">
							{member.status ?? member.role?.name}
						</span>
					)}
				</span>
			</button>
			{onMessage && member.isSelf !== true && (
				<div className="reveal absolute top-1/2 right-1.5 -translate-y-1/2 pointer-coarse:hidden">
					<IconButton
						icon={PiChatCircleDots}
						label={t("home.sendMessage")}
						size="sm"
						onClick={() => {
							onMessage(member);
						}}
					/>
				</div>
			)}
			{hasActions && (
				<ContextMenu
					label={
						<span className="flex items-center gap-2.5">
							<Avatar name={member.name} seed={member.id} src={member.avatarSrc} size="sm" animate="none" />
							{member.name}
						</span>
					}
					items={actions ?? []}
					at={menuAt}
					onClose={closeMenu}
					returnFocus={row}
				/>
			)}
		</li>
	);
}

function matches(member: Member, query: string): boolean {
	const needle = query.trim().toLowerCase();
	return (
		needle === "" ||
		member.name.toLowerCase().includes(needle) ||
		(member.role?.name.toLowerCase().includes(needle) ?? false)
	);
}

/**
 * Members list for the shell's aside: online count, search, members
 * grouped by presence with sticky headers. Rows open a profile
 * (`onSelect`); long press (touch) / right click opens `memberActions`.
 */
export function MembersPanel({
	members,
	loading = false,
	onClose,
	onSelect,
	onMessage,
	memberActions,
	className,
}: {
	members: Member[];
	loading?: boolean;
	/** Shows the close button */
	onClose?: () => void;
	onSelect?: (member: Member) => void;
	onMessage?: (member: Member) => void;
	memberActions?: (member: Member) => MenuEntry[];
	className?: string;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [query, setQuery] = useState("");
	const online = members.filter((member) => member.presence !== "offline").length;
	const visible = members
		.filter((member) => matches(member, query))
		.toSorted((lhs, rhs) => lhs.name.localeCompare(rhs.name));

	return (
		<div className={cn("flex h-full min-h-0 flex-col bg-back3 [--avatar-ring:var(--color-back3)]", className)}>
			<header className="flex shrink-0 items-start gap-2 px-4 pt-4 pb-3">
				<div className="min-w-0 flex-1">
					<h2 className="font-head text-ui-lg font-semibold tracking-tight text-text">{t("home.members")}</h2>
					{loading ? (
						<Skeleton className="mt-1.5 h-3 w-24" />
					) : (
						<p className="flex items-center gap-1.5 text-ui-xs font-medium text-good">
							<span aria-hidden className="size-2 rounded-full bg-good" />
							{t("home.onlineCount", { online, total: members.length })}
						</p>
					)}
				</div>
				{onClose && (
					<IconButton icon={PiX} label={t("home.closeMembers")} onClick={onClose} className="-mt-1 -mr-2 rounded-full" />
				)}
			</header>
			<div className="shrink-0 px-3 pb-2">
				<Search
					size="sm"
					value={query}
					onValueChange={setQuery}
					placeholder={t("home.searchMembers")}
					wrapperClassName="bg-surface"
				/>
			</div>
			<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
				{loading && (
					<div className="flex flex-col gap-3 px-2 pt-3">
						{["a", "b", "c", "d", "e"].map((key) => (
							<div key={key} className="flex items-center gap-3">
								<Skeleton shape="circle" />
								<div className="flex flex-1 flex-col gap-1.5">
									<Skeleton className="w-2/3" />
									<Skeleton className="h-2.5 w-1/3" />
								</div>
							</div>
						))}
					</div>
				)}
				{!loading && visible.length === 0 && (
					<EmptyState compact icon={PiUsersThree} title={t("home.noMembers")} />
				)}
				{!loading &&
					GROUPS.map(([presence, label]) => {
						const group = visible.filter((member) => member.presence === presence);
						if (group.length === 0) {
							return null;
						}
						return (
							<section key={presence} aria-label={t(label)}>
								<h3 className="sticky top-0 z-2 bg-back3/95 px-2 pt-3 pb-1 text-ui-2xs font-bold tracking-wider text-muted uppercase backdrop-blur-sm">
									{t(label)} — {group.length}
								</h3>
								<ul className="flex flex-col gap-0.5">
									{group.map((member) => (
										<MemberRow
											key={member.id}
											member={member}
											onSelect={onSelect}
											onMessage={onMessage}
											actions={memberActions?.(member)}
										/>
									))}
								</ul>
							</section>
						);
					})}
			</div>
		</div>
	);
}
