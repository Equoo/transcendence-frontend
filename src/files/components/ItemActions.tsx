/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type JSX, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { useFetcher } from "react-router";

import { PermEnum } from "@/admin/api/roles";
import { otherErrors, validationErrors } from "@/api/problem_detail";
import CheckButton from "@/components/Button/CheckButton";
import { Input } from "@/components/Input/Input";
import { ListActions } from "@/components/List/List";
import PopupList from "@/components/List/PopupList";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import Modal, { ModalFooter } from "@/components/Modal/Modal";
import { useUser } from "@/users/hooks/users";

import type { clientAction } from "../routes/files.route";
import FolderPicker from "./FolderPicker";

type Dialog = "rename" | "move" | "delete";

const NAME_MAX_LENGTH = 100;

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
	const [newName, setNewName] = useState(name);
	const fetcher = useFetcher<typeof clientAction>();
	const isFolder = !fileKey;
	const path = `${parent}${name}/`;
	const action = isFolder ? "/files" : `/files/${fileKey}`;
	const destinations = Array.from(new Set(["/", ...folders])).filter(
		(folder) => folder !== parent && !(isFolder && folder.startsWith(path)),
	);
	const [destination, setDestination] = useState(destinations.at(0) ?? "");
	const renameReady =
		newName.trim() !== "" && newName !== name && !newName.includes("/");
	const errors = validationErrors(fetcher.data);
	const user = useUser();

	function open(next: Dialog): void {
		setNewName(name);
		setDestination(destinations.at(0) ?? "");
		setDialog(next);
	}

	useEffect(() => {
		if (fetcher.data instanceof Response && fetcher.data.status < 300) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setDialog(null);
		}
	}, [fetcher.data]);

	return (
		<>
			{showSelect && (
				<PopupList
					className="right-15 mb-2 shadow-main border bg-surface border-border"
					onClose={() => {
						setShowSelect(false);
					}}
					rows={[
						{
							id: "rename",
							onClick: (): void => {
								open("rename");
							},
							content: <div>{t("files.rename")}</div>,
						},
						{
							id: "move",
							onClick: (): void => {
								open("move");
							},
							content: <div>{t("files.move")}</div>,
						},
						{
							id: "delete",
							onClick: (): void => {
								open("delete");
							},
							content: <div>{t("files.delete")}</div>,
						},
					]}
				/>
			)}
			{Boolean(user!.role.permission & PermEnum.HandleKnowledge) && (
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
				</ListActions>
			)}
			{dialog === "rename" && (
				<Modal
					title={
						isFolder
							? t("files.renameFolder")
							: t("files.renameFile")
					}
					onClose={() => {
						setDialog(null);
					}}
				>
					<fetcher.Form
						method="PATCH"
						action={action}
						className="contents"
					>
						{isFolder && (
							<input type="hidden" name="From" value={path} />
						)}
						<input type="hidden" name="Folder" value={parent} />
						<Input
							autoFocus
							name="Name"
							value={newName}
							maxLength={NAME_MAX_LENGTH}
							label={t("common.name")}
							placeholder={name}
							errors={
								newName.includes("/")
									? { ...errors, Name: [t("files.noSlash")] }
									: errors
							}
							onChange={(ev) => {
								setNewName(ev.target.value);
							}}
						/>
						<ModalFooter errors={otherErrors(errors, ["Name"])}>
							<CheckButton
								type="submit"
								active
								activeCheck={false}
								disabled={!renameReady}
								pending={fetcher.state !== "idle"}
							>
								{t("files.rename")}
							</CheckButton>
						</ModalFooter>
					</fetcher.Form>
				</Modal>
			)}
			{dialog === "move" && (
				<Modal
					title={
						isFolder ? t("files.moveFolder") : t("files.moveFile")
					}
					subtitle={`${parent}${name}`}
					onClose={() => {
						setDialog(null);
					}}
				>
					<fetcher.Form
						method="PATCH"
						action={action}
						className="contents"
					>
						{isFolder && (
							<input type="hidden" name="From" value={path} />
						)}
						<input type="hidden" name="Name" value={name} />
						<FolderPicker
							name="Folder"
							label={t("files.moveTo")}
							folders={destinations}
							value={destination}
							onChange={setDestination}
						/>
						<ModalFooter errors={otherErrors(errors, [])}>
							<CheckButton
								type="submit"
								active
								activeCheck={false}
								disabled={destinations.length === 0}
								pending={fetcher.state !== "idle"}
							>
								{t("files.move")}
							</CheckButton>
						</ModalFooter>
					</fetcher.Form>
				</Modal>
			)}
			{dialog === "delete" && (
				<ConfirmModal
					title={
						isFolder
							? t("files.deleteFolderTitle")
							: t("files.deleteFileTitle")
					}
					description={
						isFolder
							? t("files.deleteFolderDesc")
							: t("common.irreversible")
					}
					confirmLabel={t("files.delete")}
					danger
					pending={fetcher.state !== "idle"}
					onClose={() => {
						setDialog(null);
					}}
					onConfirm={() => {
						void fetcher.submit(isFolder ? { From: path } : null, {
							action,
							method: "DELETE",
						});
					}}
				/>
			)}
		</>
	);
}
