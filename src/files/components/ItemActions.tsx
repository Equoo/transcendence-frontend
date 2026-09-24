import { type JSX, useEffect, useState } from "react";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { useFetcher } from "react-router";

import CheckButton from "@/components/CheckButton";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { ListActions } from "@/components/List";
import Modal from "@/components/Modal";
import PopupList from "@/components/PopupList";

import type { clientAction } from "../routes/files.route";

type Dialog = "rename" | "move" | "delete";

/**
 * Rename / move / delete menu for a file (`fileKey` set) or a folder
 * (`fileKey` unset, the folder being `parent + name + "/"`).
 */
export default function ItemActions({
	fileKey,
	parent,
	name,
	folders,
}: {
	fileKey?: string;
	parent: string;
	name: string;
	folders: string[];
}): JSX.Element {
	const [showSelect, setShowSelect] = useState(false);
	const [dialog, setDialog] = useState<Dialog | null>(null);
	const fetcher = useFetcher<typeof clientAction>();
	const isFolder = !fileKey;
	const path = `${parent}${name}/`;
	const kind = isFolder ? "folder" : "file";
	const action = isFolder ? "/files" : `/files/${fileKey}`;
	const destinations = [""]
		.concat(folders)
		.filter(
			(folder) =>
				folder !== parent && !(isFolder && folder.startsWith(path)),
		);

	useEffect(() => {
		if (fetcher.data instanceof Response && fetcher.data.status < 300) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setDialog(null);
		}
	}, [fetcher.data]);

	return (
		<>
			<ListActions className="relative">
				<PiDotsThreeVerticalBold
					aria-label={`Actions for ${kind} ${name}`}
					onClick={() => {
						setShowSelect(true);
					}}
					size={18}
					className="cursor-pointer hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
				/>
				{showSelect && (
					<PopupList
						className="right-5 mb-8"
						onClose={() => {
							setShowSelect(false);
						}}
						rows={[
							{
								id: "rename",
								onClick: (): void => {
									setDialog("rename");
								},
								content: <div>Rename</div>,
							},
							{
								id: "move",
								onClick: (): void => {
									setDialog("move");
								},
								content: <div>Move</div>,
							},
							{
								id: "delete",
								onClick: (): void => {
									setDialog("delete");
								},
								content: <div>Delete</div>,
							},
						]}
					/>
				)}
			</ListActions>
			{dialog === "rename" && (
				<Modal
					title={`Rename ${kind}`}
					width="w-4/10"
					onClose={() => {
						setDialog(null);
					}}
				>
					<fetcher.Form
						method="PATCH"
						action={action}
						className="flex flex-col gap-4 w-7/10 items-center"
					>
						{isFolder && (
							<input type="hidden" name="From" value={path} />
						)}
						<input type="hidden" name="Folder" value={parent} />
						<Input
							name="Name"
							value={name}
							pattern={isFolder ? "[^/]+" : ".*"}
							title={isFolder ? "Must not contain /" : ""}
							required
						/>
						<CheckButton
							type="submit"
							active
							pending={fetcher.state !== "idle"}
						>
							Rename
						</CheckButton>
					</fetcher.Form>
				</Modal>
			)}
			{dialog === "move" && (
				<Modal
					title={`Move ${kind}`}
					width="w-4/10"
					onClose={() => {
						setDialog(null);
					}}
				>
					<fetcher.Form
						method="PATCH"
						action={action}
						className="flex flex-col gap-4 w-7/10 items-center"
					>
						{isFolder && (
							<input type="hidden" name="From" value={path} />
						)}
						<input type="hidden" name="Name" value={name} />
						<Field name="Folder" required>
							<select
								name="Folder"
								required
								className="w-full bg-surface border rounded-md border-border2 focus:border-accent px-2 py-1 font-main text-text"
							>
								{destinations.map((folder) => (
									<option key={folder} value={folder}>
										{folder === "" ? "/" : folder}
									</option>
								))}
							</select>
						</Field>
						<CheckButton
							type="submit"
							active
							pending={fetcher.state !== "idle"}
						>
							Move
						</CheckButton>
					</fetcher.Form>
				</Modal>
			)}
			{dialog === "delete" && (
				<Modal
					width="w-fit"
					title={`Delete this ${kind} ?`}
					onClose={() => {
						setDialog(null);
					}}
				>
					<p className="text-muted font-main font-light w-4/5 text-sm text-center">
						{isFolder
							? "All files in this folder will be deleted. This cannot be cancelled."
							: "This cannot be cancelled."}
					</p>
					<div className="inline-flex gap-8">
						<CheckButton
							pending={fetcher.state !== "idle"}
							onClick={() => {
								void fetcher.submit(
									isFolder ? { From: path } : null,
									{ action, method: "DELETE" },
								);
							}}
						>
							Yes
						</CheckButton>
						<CheckButton
							active
							activeCheck={false}
							onClick={() => {
								setDialog(null);
							}}
						>
							No
						</CheckButton>
					</div>
				</Modal>
			)}
		</>
	);
}
