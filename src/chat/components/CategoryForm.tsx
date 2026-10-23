import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiGear, PiPlus } from "react-icons/pi";

import { fetchRoles } from "@/admin/api/roles";
import { otherErrors, validationErrors } from "@/api/problem_detail";
import CheckButton from "@/components/Button/CheckButton";
import { Input } from "@/components/Input/Input";
import ChoiceModal from "@/components/Modal/ChoiceModal";
import Modal, { ModalActions, ModalFooter } from "@/components/Modal/Modal";
import Tooltip from "@/components/Tooltip";
import { useModalFetcher } from "@/hooks/useModalFetcher";

import type { ChannelCategory } from "../api/chat.api";
import RolesField from "./RolesField";

const FIELD_KEYS = ["Name", "Roles"];

export function CategoryModal({
	edit,
	onClose,
}: {
	edit?: ChannelCategory | null;
	onClose: () => void;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const fetcher = useModalFetcher({ onClose });
	const [roles] = useState(fetchRoles);
	const [whitelist, setWhitelist] = useState(
		() => edit?.rolesWhitelist.map((role) => role.name) ?? [],
	);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const errors = validationErrors(fetcher.data);

	return (
		<>
			<Modal
				title={
					edit
						? t("chat.editCategoryTitle", { name: edit.name })
						: t("chat.createCategoryTitle")
				}
				subtitle={
					edit
						? t("chat.editCategoryHint", { name: edit.name })
						: t("chat.createCategoryHint")
				}
				onClose={onClose}
			>
				<fetcher.Form
					action="/category"
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
							placeholder={t("chat.categoryNamePlaceholder")}
							value={edit?.name}
						/>
						<RolesField
							roles={roles}
							selected={whitelist}
							errors={errors}
							onChange={setWhitelist}
						/>
					</div>
					{edit && <input type="hidden" name="id" value={edit.id} />}
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
					title={t("chat.deleteCategoryTitle", { name: edit.name })}
					desc={t("common.irreversible")}
					confirmLabel={t("common.delete")}
					action="/category"
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

export default function CategoryForm({
	edit,
	className,
}: {
	edit?: ChannelCategory | null;
	className?: string;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [showModal, setShowModal] = useState(false);
	const label = edit ? t("chat.editCategory") : t("chat.createCategoryTitle");

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
				<CategoryModal
					edit={edit}
					onClose={() => {
						setShowModal(false);
					}}
				/>
			)}
		</>
	);
}
