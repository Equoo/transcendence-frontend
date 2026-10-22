import type { JSX } from "react";

import { HEADER_PADDING } from "./BackToList";

const NAME_WIDTHS = ["w-28", "w-20", "w-32", "w-24", "w-16", "w-36"];
const LINE_WIDTHS = ["w-40", "w-28", "w-48", "w-32", "w-24", "w-44"];

function Avatar({ className = "size-10" }: { className?: string }): JSX.Element {
	return <div className={`shrink-0 rounded-full bg-border ${className}`} />;
}

export function ConversationListSkeleton({ count = 6 }: { count?: number }): JSX.Element {
	return (
		<>
			{Array.from({ length: count }, (___, index) => (
				<li key={index} className="flex items-center gap-2 px-2 py-1.5 animate-pulse">
					<Avatar />
					<div className="flex flex-col gap-1.5 min-w-0">
						<div className={`h-3.5 rounded bg-border ${NAME_WIDTHS[index % NAME_WIDTHS.length]}`} />
						<div className={`h-3 rounded bg-border ${LINE_WIDTHS[index % LINE_WIDTHS.length]}`} />
					</div>
				</li>
			))}
		</>
	);
}

export function FriendListSkeleton({ count = 5 }: { count?: number }): JSX.Element {
	return (
		<div className="flex flex-col gap-5 animate-pulse">
			<div className="h-10 w-full rounded-xl bg-border" />
			<section>
				<div className="h-3 w-24 mx-1 mb-3 rounded bg-border" />
				<ul className="flex flex-col rounded-xl border border-border bg-surface">
					{Array.from({ length: count }, (___, index) => (
						<li key={index} className="flex items-center gap-3 px-3 py-2.5 border-t border-border first:border-t-0">
							<Avatar />
							<div className="flex flex-col gap-1.5 flex-1">
								<div className={`h-3.5 rounded bg-border ${NAME_WIDTHS[index % NAME_WIDTHS.length]}`} />
								<div className="h-3 w-16 rounded bg-border" />
							</div>
							<div className="size-9 rounded-full bg-border" />
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}

export function OnlineFriendsSkeleton({ count = 4 }: { count?: number }): JSX.Element {
	return (
		<section className="animate-pulse">
			<div className="h-3 w-28 mx-1 mb-3 rounded bg-border" />
			<div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3">
				{Array.from({ length: count }, (___, index) => (
					<div key={index} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-surface">
						<Avatar className="size-15" />
						<div className={`h-3.5 rounded bg-border ${NAME_WIDTHS[index % NAME_WIDTHS.length]}`} />
					</div>
				))}
			</div>
		</section>
	);
}

export function RecentConversationsSkeleton({ count = 4 }: { count?: number }): JSX.Element {
	return (
		<section className="animate-pulse">
			<div className="h-3 w-36 mx-1 mb-3 rounded bg-border" />
			<div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
				{Array.from({ length: count }, (___, index) => (
					<div key={index} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface">
						<Avatar />
						<div className="flex flex-col gap-1.5 min-w-0">
							<div className={`h-3.5 rounded bg-border ${NAME_WIDTHS[index % NAME_WIDTHS.length]}`} />
							<div className={`h-3 rounded bg-border ${LINE_WIDTHS[index % LINE_WIDTHS.length]}`} />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export function ListRowsSkeleton({ count = 4 }: { count?: number }): JSX.Element {
	return (
		<ul className="flex flex-col gap-1 animate-pulse">
			{Array.from({ length: count }, (___, index) => (
				<li key={index} className="flex items-center gap-3 px-2 py-2">
					<div className="size-6 shrink-0 rounded-md bg-border" />
					<div className={`h-3.5 rounded bg-border ${LINE_WIDTHS[index % LINE_WIDTHS.length]}`} />
				</li>
			))}
		</ul>
	);
}

const MESSAGE_LINES = [["w-64", "w-40"], ["w-52"], ["w-72", "w-56", "w-32"], ["w-44"], ["w-60", "w-36"]];

export function ConversationChatSkeleton(): JSX.Element {
	return (
		<div className="flex flex-col w-full h-full animate-pulse">
			<div className={`flex flex-none items-center gap-3 border-b border-border py-2.5 ${HEADER_PADDING}`}>
				<Avatar />
				<div className="flex flex-col gap-1.5">
					<div className="h-4 w-32 rounded bg-border" />
					<div className="h-3 w-20 rounded bg-border" />
				</div>
			</div>
			<div className="flex flex-1 min-h-0 flex-col justify-end gap-4.5 px-5.5 pb-5 overflow-hidden">
				{MESSAGE_LINES.map((lines, index) => (
					<div key={lines.join()} className="flex gap-3">
						<Avatar />
						<div className="flex flex-col gap-2 pt-0.5">
							<div className="flex items-center gap-2">
								<div className={`h-3.5 rounded bg-border ${NAME_WIDTHS[index % NAME_WIDTHS.length]}`} />
								<div className="h-3 w-10 rounded bg-border opacity-60" />
							</div>
							{lines.map((width) => (
								<div key={width} className={`h-3 max-w-full rounded bg-border ${width}`} />
							))}
						</div>
					</div>
				))}
			</div>
			<div className="flex-none px-5.5 pb-5">
				<div className="h-12 w-full rounded-xl bg-border" />
			</div>
		</div>
	);
}
