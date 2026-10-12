import { type JSX, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { useFetcher } from "react-router";

import CheckButton from "@/components/Button/CheckButton";
import { Field } from "@/components/Input/Field";
import { Input } from "@/components/Input/Input";
import { ListActions } from "@/components/List/List";
import PopupList from "@/components/List/PopupList";
import Modal from "@/components/Modal/Modal";

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
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [showSelect, setShowSelect] = useState(false);
	const [dialog, setDialog] = useState<Dialog | null>(null);
	const fetcher = useFetcher<typeof clientAction>();
	const isFolder = !fileKey;
	const path = `${parent}${name}/`;
	const action = isFolder ? "/files" : `/files/${fileKey}`;
	const destinations = Array.from(new Set(["/", ...folders])).filter(
		(folder) => folder !== parent && !(isFolder && folder.startsWith(path)),
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
					aria-label={
						isFolder
							? t("files.actionsForFolder", { name })
							: t("files.actionsForFile", { name })
					}
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
								content: <div>{t("files.rename")}</div>,
							},
							{
								id: "move",
								onClick: (): void => {
									setDialog("move");
								},
								content: <div>{t("files.move")}</div>,
							},
							{
								id: "delete",
								onClick: (): void => {
									setDialog("delete");
								},
								content: <div>{t("files.delete")}</div>,
							},
						]}
					/>
				)}
			</ListActions>
			{dialog === "rename" && (
				<Modal
					title={
						isFolder
							? t("files.renameFolder")
							: t("files.renameFile")
					}
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
							label={t("common.name")}
							value={name}
							pattern="^[^\/]*$"
							title={t("files.noSlash")}
							required
						/>
						<CheckButton
							type="submit"
							active
							pending={fetcher.state !== "idle"}
						>
							{t("files.rename")}
						</CheckButton>
					</fetcher.Form>
				</Modal>
			)}
			{dialog === "move" && (
				<Modal
					title={
						isFolder
							? t("files.moveFolder")
							: t("files.moveFile")
					}
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
						<Field
							name="Folder"
							label={t("files.folder")}
							required
						>
							<select
								name="Folder"
								required
								className="w-full bg-surface border rounded-md border-border2 focus:border-accent px-2 py-1 font-main text-text"
							>
								{destinations.map((folder) => (
									<option key={folder} value={folder}>
										{folder}
									</option>
								))}
							</select>
						</Field>
						<CheckButton
							type="submit"
							active
							pending={fetcher.state !== "idle"}
						>
							{t("files.move")}
						</CheckButton>
					</fetcher.Form>
				</Modal>
			)}
			{dialog === "delete" && (
				<Modal
					width="w-fit"
					title={
						isFolder
							? t("files.deleteFolderTitle")
							: t("files.deleteFileTitle")
					}
					onClose={() => {
						setDialog(null);
					}}
				>
					<p className="text-muted font-main font-light w-4/5 text-sm text-center">
						{isFolder
							? t("files.deleteFolderDesc")
							: t("common.irreversible")}
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
							{t("common.yes")}
						</CheckButton>
						<CheckButton
							active
							activeCheck={false}
							onClick={() => {
								setDialog(null);
							}}
						>
							{t("common.no")}
						</CheckButton>
					</div>
				</Modal>
			)}
		</>
	);
}
