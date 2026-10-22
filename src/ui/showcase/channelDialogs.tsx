import type { JSX } from "react";
import { PiHash } from "react-icons/pi";

import {
	Button,
	ConfirmDialog,
	Field,
	Input,
	Modal,
	ModalActions,
	Switch,
	TextArea,
} from "@/ui";

import type { DemoCategory, Dialog } from "./channels";

export function DemoDialogs({
	dialog,
	tree,
	setTree,
	onClose,
}: {
	dialog: Dialog;
	tree: DemoCategory[];
	setTree: (tree: DemoCategory[]) => void;
	onClose: () => void;
}): JSX.Element | null {
	if (dialog === null) {
		return null;
	}
	switch (dialog.type) {
		case "edit-channel":
		case "add-channel": {
			const edit = dialog.type === "edit-channel";
			return (
				<Modal
					title={edit ? "Edit channel" : "New channel"}
					subtitle={edit ? `#${dialog.channel.name}` : `In ${dialog.category.name}`}
					onClose={onClose}
					footer={
						<ModalActions>
							<Button variant="ghost" onClick={onClose}>Cancel</Button>
							<Button variant="primary" onClick={onClose}>{edit ? "Save" : "Create"}</Button>
						</ModalActions>
					}
				>
					<div className="flex flex-col gap-4">
						<Field label="Name" required>
							<Input leftIcon={PiHash} defaultValue={edit ? dialog.channel.name : ""} placeholder="new-channel" />
						</Field>
						<Field label="Topic" optionalLabel="optional">
							<TextArea rows={2} autoGrow />
						</Field>
						<Field label="Private channel" hint="Only selected roles can see it" inline>
							<Switch defaultChecked={edit && dialog.channel.isPrivate === true} />
						</Field>
					</div>
				</Modal>
			);
		}
		case "edit-category":
			return (
				<Modal
					title="Edit category"
					size="sm"
					onClose={onClose}
					footer={
						<ModalActions>
							<Button variant="ghost" onClick={onClose}>Cancel</Button>
							<Button variant="primary" onClick={onClose}>Save</Button>
						</ModalActions>
					}
				>
					<Field label="Name" required>
						<Input defaultValue={dialog.category.name} />
					</Field>
				</Modal>
			);
		case "delete-channel":
			return (
				<ConfirmDialog
					title={`Delete #${dialog.channel.name}?`}
					message="All its messages will be lost. This cannot be undone."
					confirmLabel="Delete"
					danger
					onConfirm={() => {
						setTree(tree.map((cat) => ({ ...cat, channels: cat.channels.filter((ch) => ch.id !== dialog.channel.id) })));
					}}
					onClose={onClose}
				/>
			);
		case "delete-category":
			return (
				<ConfirmDialog
					title={`Delete ${dialog.category.name}?`}
					message="Its channels move to the top of the list."
					confirmLabel="Delete"
					danger
					onConfirm={() => {
						setTree(tree.filter((cat) => cat.id !== dialog.category.id));
					}}
					onClose={onClose}
				/>
			);
		default:
			return null;
	}
}
