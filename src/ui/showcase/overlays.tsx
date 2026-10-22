import { type JSX, useCallback, useState } from "react";
import {
	PiArrowBendUpLeft,
	PiCopy,
	PiDotsThreeBold,
	PiHash,
	PiPencilSimple,
	PiPushPin,
	PiSmiley,
	PiTrash,
} from "react-icons/pi";

import {
	Avatar,
	Button,
	ConfirmDialog,
	ContextMenu,
	CountBadge,
	Drawer,
	Field,
	IconButton,
	Input,
	ListItem,
	Menu,
	type MenuEntry,
	Modal,
	ModalActions,
	Popover,
	type PressPoint,
	Sheet,
	TextArea,
	useLongPress,
} from "@/ui";

import { Row, Section } from "./sections";

type Open = "form" | "confirm" | "sheet" | "drawer-start" | "drawer-end" | "full" | null;

function Hint({ children }: { children: string }): JSX.Element {
	return <p className="-mt-1 text-ui-xs text-text2">{children}</p>;
}

const EMOJIS = ["👍", "❤️", "😂", "🎉", "🔥"];

/** Chat message: hold or right-click it to open its actions */
function MessageDemo({ onAction }: { onAction: (action: string) => void }): JSX.Element {
	const [menuAt, setMenuAt] = useState<PressPoint | null>(null);
	const press = useLongPress(setMenuAt);
	const closeMenu = useCallback(() => {
		setMenuAt(null);
	}, []);
	const act = (label: string) => (): void => {
		onAction(label);
	};
	const items: MenuEntry[] = [
		{ id: "reply", label: "Reply", icon: PiArrowBendUpLeft, onSelect: act("reply") },
		{ id: "edit", label: "Edit message", icon: PiPencilSimple, onSelect: act("edit") },
		{ id: "copy", label: "Copy text", icon: PiCopy, onSelect: act("copy") },
		{ id: "pin", label: "Pin message", icon: PiPushPin, onSelect: act("pin") },
		{ id: "sep", separator: true },
		{ id: "delete", label: "Delete message", icon: PiTrash, danger: true, onSelect: act("delete") },
	];

	return (
		<>
			<div
				{...press}
				tabIndex={0}
				aria-haspopup="menu"
				className="tap hold-fill no-callout flex max-w-md cursor-default gap-3 rounded-ui-md border border-border bg-surface2 p-3 outline-none focus-visible:outline-2 focus-visible:outline-accent active:bg-hover"
			>
				<Avatar name="Luna Park" size="md" />
				<div className="min-w-0">
					<p className="text-ui-sm">
						<span className="font-semibold text-text">Luna Park</span>{" "}
						<span className="text-muted">12:04</span>
					</p>
					<p className="text-ui-base text-text">See you at the raid tonight! Hold me 👆</p>
				</div>
			</div>
			<ContextMenu
				label="Message"
				items={items}
				at={menuAt}
				onClose={closeMenu}
				header={
					<div className="flex justify-around gap-1 pb-1 text-2xl">
						{EMOJIS.map((emoji) => (
							<button
								key={emoji}
								type="button"
								aria-label={`React ${emoji}`}
								className="tap grid size-11 place-items-center rounded-full cursor-pointer hover:bg-hover active:scale-90 active:bg-border"
								onClick={() => {
									onAction(emoji);
									closeMenu();
								}}
							>
								{emoji}
							</button>
						))}
					</div>
				}
			/>
		</>
	);
}

export function OverlaysSection(): JSX.Element {
	const [open, setOpen] = useState<Open>(null);
	const [lastAction, setLastAction] = useState("none");
	const show = (what: Open) => (): void => {
		setOpen(what);
	};

	function close(): void {
		setOpen(null);
	}

	return (
		<Section id="overlays" title={`Overlays · last action: ${lastAction}`}>
			<Row label="Responsive: adapts to the screen">
				<Button variant="primary" onClick={show("form")}>Form modal</Button>
				<Button variant="danger-ghost" onClick={show("confirm")}>Confirm dialog</Button>
				<Menu
					label="Message actions"
					trigger={(props) => (
						<Button {...props} rightIcon={PiDotsThreeBold}>Menu</Button>
					)}
					items={[
						{ id: "reply", label: "Reply", icon: PiArrowBendUpLeft, onSelect: (): void => { setLastAction("reply"); } },
						{ id: "edit", label: "Edit", icon: PiPencilSimple, hint: "E", onSelect: (): void => { setLastAction("edit"); } },
						{ id: "pin", label: "Pin", icon: PiPushPin, disabled: true, onSelect: (): void => { setLastAction("pin"); } },
						{ id: "sep", separator: true },
						{ id: "delete", label: "Delete", icon: PiTrash, danger: true, onSelect: (): void => { setLastAction("delete"); } },
					]}
				/>
				<Popover label="Reactions" trigger={(props) => <Button {...props} leftIcon={PiSmiley}>Popover</Button>}>
					{(closePopover) => (
						<div className="flex gap-1 text-2xl">
							{EMOJIS.map((emoji) => (
								<button
									key={emoji}
									type="button"
									className="tap grid size-11 place-items-center rounded-ui-sm cursor-pointer hover:bg-hover active:scale-90 active:bg-border"
									onClick={() => {
										setLastAction(emoji);
										closePopover();
									}}
								>
									{emoji}
								</button>
							))}
						</div>
					)}
				</Popover>
			</Row>
			<Hint>Tablet / desktop: centered dialog, floating menu. Phone (&lt;768px): bottom sheet, swipe it down to close. Try the device preview below.</Hint>

			<Row label="Forced presentation: same on every screen">
				<Button onClick={show("sheet")}>Bottom sheet</Button>
				<Button onClick={show("drawer-start")}>Drawer left</Button>
				<Button onClick={show("drawer-end")}>Drawer right</Button>
				<Button onClick={show("full")}>Fullscreen</Button>
			</Row>

			<Row label="Long press / right click">
				<MessageDemo onAction={setLastAction} />
			</Row>
			<Hint>Touch: hold with a finger, the accent fill grows, then the actions open (sheet on phones). Mouse: right click or the context-menu key. Same for the channels in the sidebar.</Hint>

			{open === "form" && (
				<Modal
					title="New channel"
					subtitle="Channels organise conversations by topic."
					onClose={close}
					footer={
						<ModalActions>
							<Button variant="ghost" onClick={close}>Cancel</Button>
							<Button variant="primary" onClick={close}>Create</Button>
						</ModalActions>
					}
				>
					<div className="flex flex-col gap-4">
						<Field label="Name" required>
							<Input leftIcon={PiHash} placeholder="general" />
						</Field>
						<Field label="Topic" optionalLabel="optional">
							<TextArea rows={3} />
						</Field>
					</div>
				</Modal>
			)}
			{open === "confirm" && (
				<ConfirmDialog
					title="Delete this message?"
					message="This cannot be undone."
					confirmLabel="Delete"
					danger
					onConfirm={async () => {
						await new Promise((resolve) => { setTimeout(resolve, 1000); });
						setLastAction("confirmed delete");
					}}
					onClose={close}
				/>
			)}
			{open === "sheet" && (
				<Sheet title="Share to…" onClose={close}>
					{["Luna Park", "Max Ortega", "Sam"].map((name) => (
						<ListItem key={name} leading={<Avatar name={name} size="sm" />} title={name} onClick={close} dense />
					))}
				</Sheet>
			)}
			{(open === "drawer-start" || open === "drawer-end") && (
				<Drawer side={open === "drawer-start" ? "start" : "end"} title="Drawer" onClose={close}>
					<p className="px-5 text-ui-base text-text2">Swipe it back towards its edge, tap outside or press Escape to close.</p>
				</Drawer>
			)}
			{open === "full" && (
				<Modal title="Fullscreen" size="full" onClose={close}>
					<p className="text-ui-base text-text2">Fullscreen on every screen size.</p>
				</Modal>
			)}
		</Section>
	);
}

export function ListsSection(): JSX.Element {
	const [selected, setSelected] = useState("Luna Park");

	return (
		<Section id="lists" title="List items">
			<div className="flex flex-col gap-0.5">
				{[
					{ name: "Luna Park", last: "See you at the raid tonight!", time: "12:04", unread: 2 },
					{ name: "Max Ortega", last: "Sent the route file", time: "Yesterday", unread: 0 },
					{ name: "Sam", last: "ok", time: "Mon", unread: 0 },
				].map((conv) => (
					<ListItem
						key={conv.name}
						leading={<Avatar name={conv.name} presence={conv.unread > 0 ? "online" : "offline"} />}
						title={conv.name}
						subtitle={conv.last}
						meta={conv.time}
						unread={conv.unread > 0}
						active={selected === conv.name}
						onClick={() => { setSelected(conv.name); }}
						trailing={<CountBadge count={conv.unread} />}
						actions={
							<>
								<IconButton icon={PiPencilSimple} label="Rename" size="sm" />
								<IconButton icon={PiTrash} label="Delete" size="sm" variant="danger" />
							</>
						}
					/>
				))}
			</div>
		</Section>
	);
}
