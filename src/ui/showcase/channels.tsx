import { type ReactNode, useState } from "react";
import {
	PiArrowsInLineVertical,
	PiBell,
	PiBellSlash,
	PiCheckCircle,
	PiLink,
	PiPencilSimple,
	PiPlus,
	PiTrash,
} from "react-icons/pi";
import { toast } from "react-toastify";

import type { MenuEntry } from "@/ui";
import { ChannelCategory } from "@/ui/channels/ChannelCategory";
import { ChannelItem,type ChannelKind } from "@/ui/channels/ChannelItem";

import { DemoDialogs } from "./channelDialogs";

export interface DemoChannel {
	id: string;
	name: string;
	kind: ChannelKind;
	isPrivate?: boolean;
	unread?: boolean;
	mentions?: number;
	muted?: boolean;
}

export interface DemoCategory {
	id: string;
	name: string;
	channels: DemoChannel[];
}

const INITIAL: DemoCategory[] = [
	{
		id: "info",
		name: "Information",
		channels: [
			{ id: "announcements", name: "announcements", kind: "announcement", unread: true },
			{ id: "rules", name: "rules", kind: "text", isPrivate: true },
		],
	},
	{
		id: "talk",
		name: "General",
		channels: [
			{ id: "general", name: "general", kind: "text", unread: true, mentions: 3 },
			{ id: "raids", name: "raids", kind: "text" },
			{ id: "off-topic", name: "off-topic", kind: "text", muted: true },
			{ id: "lounge", name: "Lounge", kind: "voice" },
		],
	},
];

export type Dialog =
	| { type: "edit-channel"; channel: DemoChannel }
	| { type: "delete-channel"; channel: DemoChannel }
	| { type: "add-channel"; category: DemoCategory }
	| { type: "edit-category"; category: DemoCategory }
	| { type: "delete-category"; category: DemoCategory }
	| null;

function updateChannel(tree: DemoCategory[], id: string, patch: Partial<DemoChannel>): DemoCategory[] {
	return tree.map((cat) => ({
		...cat,
		channels: cat.channels.map((ch) => (ch.id === id ? { ...ch, ...patch } : ch)),
	}));
}

/** Demo state: channel tree + the settings overlays it opens */
export function useChannelsDemo(): { tree: ReactNode; dialogs: ReactNode } {
	const [tree, setTree] = useState(INITIAL);
	const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
	const [dialog, setDialog] = useState<Dialog>(null);

	function close(): void {
		setDialog(null);
	}

	function channelActions(channel: DemoChannel): MenuEntry[] {
		return [
			{
				id: "read",
				label: "Mark as read",
				icon: PiCheckCircle,
				disabled: channel.unread !== true && (channel.mentions ?? 0) === 0,
				onSelect: (): void => {
					setTree(updateChannel(tree, channel.id, { unread: false, mentions: 0 }));
				},
			},
			{
				id: "mute",
				label: channel.muted === true ? "Unmute" : "Mute",
				icon: channel.muted === true ? PiBell : PiBellSlash,
				onSelect: (): void => {
					setTree(updateChannel(tree, channel.id, { muted: channel.muted !== true }));
				},
			},
			{
				id: "link",
				label: "Copy link",
				icon: PiLink,
				onSelect: (): void => {
					toast.success(`Link to #${channel.name} copied`);
				},
			},
			{ id: "sep", separator: true },
			{
				id: "edit",
				label: "Edit channel",
				icon: PiPencilSimple,
				onSelect: (): void => {
					setDialog({ type: "edit-channel", channel });
				},
			},
			{
				id: "delete",
				label: "Delete channel",
				icon: PiTrash,
				danger: true,
				onSelect: (): void => {
					setDialog({ type: "delete-channel", channel });
				},
			},
		];
	}

	function categoryActions(category: DemoCategory): MenuEntry[] {
		return [
			{
				id: "add",
				label: "Add channel",
				icon: PiPlus,
				onSelect: (): void => {
					setDialog({ type: "add-channel", category });
				},
			},
			{
				id: "edit",
				label: "Edit category",
				icon: PiPencilSimple,
				onSelect: (): void => {
					setDialog({ type: "edit-category", category });
				},
			},
			{
				id: "collapse",
				label: "Collapse all",
				icon: PiArrowsInLineVertical,
				onSelect: (): void => {
					setCollapsed(Object.fromEntries(tree.map((cat) => [cat.id, true])));
				},
			},
			{ id: "sep", separator: true },
			{
				id: "delete",
				label: "Delete category",
				icon: PiTrash,
				danger: true,
				onSelect: (): void => {
					setDialog({ type: "delete-category", category });
				},
			},
		];
	}

	const treeNode = tree.map((category) => (
		<ChannelCategory
			key={category.id}
			name={category.name}
			collapsed={collapsed[category.id] ?? false}
			onCollapsedChange={(value) => {
				setCollapsed({ ...collapsed, [category.id]: value });
			}}
			onAdd={() => {
				setDialog({ type: "add-channel", category });
			}}
			addLabel={`Add a channel to ${category.name}`}
			actions={categoryActions(category)}
		>
			{category.channels.map((channel) => (
				<ChannelItem
					key={channel.id}
					to={`/_ui/${channel.id}`}
					name={channel.name}
					kind={channel.kind}
					isPrivate={channel.isPrivate}
					unread={channel.unread}
					mentions={channel.mentions}
					muted={channel.muted}
					actions={channelActions(channel)}
				/>
			))}
		</ChannelCategory>
	));

	return { tree: treeNode, dialogs: <DemoDialogs dialog={dialog} tree={tree} setTree={setTree} onClose={close} /> };
}
