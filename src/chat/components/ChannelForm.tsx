import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiGear, PiPlus } from "react-icons/pi";

import { fetchRoles } from "@/admin/api/roles";
import { otherErrors, validationErrors } from "@/api/problem_detail";
import CheckButton from "@/components/Button/CheckButton";
import { Input } from "@/components/Input/Input";
import { Slidebox } from "@/components/Input/Slidebox";
import ChoiceModal from "@/components/Modal/ChoiceModal";
import Modal, { ModalActions, ModalFooter } from "@/components/Modal/Modal";
import Tooltip from "@/components/Tooltip";
import { useModalFetcher } from "@/hooks/useModalFetcher";

import type { Channel } from "../api/chat.api";
import RolesField from "./RolesField";

const FIELD_KEYS = ["Name", "Topic", "Syncronised", "Roles"];

function ChannelModal({
	edit,
	category,
	onClose,
}: {
	edit?: Channel | null;
	category?: string;
	onClose: () => void;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const fetcher = useModalFetcher({ onClose });
	const [roles] = useState(fetchRoles);
	const [whitelist, setWhitelist] = useState(
		() => edit?.rolesWhitelist.map((role) => role.name) ?? [],
	);
	const [sync, setSync] = useState(edit?.categorySync ?? false);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const errors = validationErrors(fetcher.data);

	return (
		<>
			<Modal
				title={
					edit
						? t("chat.editChannelTitle", { name: edit.name })
						: t("chat.createChannelTitle")
				}
				subtitle={
					edit
						? t("chat.editChannelHint", { name: edit.name })
						: t("chat.createChannelHint")
				}
				onClose={onClose}
			>
				<fetcher.Form
					action="/channels"
					method={edit ? "put" : "post"}
					className="contents"
				>
					<div className="flex flex-col gap-4">
						<Input
							autoFocus
							name="Name"
							label={t("common.name")}
							required
							errors={errors}
							placeholder={t("chat.channelNamePlaceholder")}
							value={edit?.name}
						/>
						<Input
							name="Topic"
							label={t("chat.topic")}
							errors={errors}
							placeholder={t("chat.channelTopicPlaceholder")}
							value={edit?.topic}
						/>
						<Slidebox
							name="Syncronised"
							label={t("chat.synchronised")}
							hint={t("chat.useCategoryRoles")}
							errors={errors}
							checked={sync}
							onChange={(ev) => {
								setSync(ev.currentTarget.checked);
							}}
						/>
						<RolesField
							roles={roles}
							selected={whitelist}
							disabled={sync}
							errors={errors}
							onChange={setWhitelist}
						/>
					</div>
					{edit && <input type="hidden" name="id" value={edit.id} />}
					<input
						type="hidden"
						name="category"
						value={category ?? ""}
					/>
					<ModalFooter errors={otherErrors(errors, FIELD_KEYS)}>
						<ModalActions>
							{edit && (
								<CheckButton
									danger
									onClick={() => {
										setConfirmDelete(true);
									}}
								>
									{t("common.delete")}
								</CheckButton>
							)}
							<CheckButton
								active
								activeCheck={false}
								type="submit"
								pending={fetcher.state !== "idle"}
							>
								{edit ? t("common.save") : t("common.create")}
							</CheckButton>
						</ModalActions>
					</ModalFooter>
				</fetcher.Form>
			</Modal>
			{edit && confirmDelete && (
				<ChoiceModal
					title={t("chat.deleteChannelTitle", { name: edit.name })}
					desc={t("common.irreversible")}
					confirmLabel={t("common.delete")}
					action="/channels"
					method="DELETE"
					id={edit.id}
					then={onClose}
					onClose={() => {
						setConfirmDelete(false);
					}}
				/>
			)}
		</>
	);
}

export default function ChannelForm({
	edit,
	category,
	className,
}: {
	edit?: Channel | null;
	category?: string;
	className?: string;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [showModal, setShowModal] = useState(false);
	const label = edit ? t("chat.editChannel") : t("chat.createChannelTitle");

	return (
		<>
			<Tooltip
				content={label}
				focusable={false}
				className={`relative z-1 ml-auto inline-flex ${className}`}
			>
				<button
					className="p-0.5 cursor-pointer text-muted hover:text-text"
					type="button"
					name="channelForm"
					aria-label={label}
					onClick={() => {
						setShowModal(true);
					}}
				>
					{edit ? <PiGear size={14}></PiGear> : <PiPlus size={14} />}
				</button>
			</Tooltip>
			{showModal && (
				<ChannelModal
					edit={edit}
					category={category}
					onClose={() => {
						setShowModal(false);
					}}
				/>
			)}
		</>
	);
}
