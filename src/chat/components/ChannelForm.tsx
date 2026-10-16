import { type JSX, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { PiGear, PiPlus } from "react-icons/pi";
import { useFetcher } from "react-router";

import { fetchRoles, type Role } from "@/admin/api/roles";
import { APIError, type ValidationErrors } from "@/api/problem_detail";
import CheckButton from "@/components/Button/CheckButton";
import { Checkbox } from "@/components/Input/Checkbox";
import { Input } from "@/components/Input/Input";
import MultipleInput from "@/components/Input/MultipleInput";
import Modal from "@/components/Modal/Modal";
import Promisable from "@/components/Promisable";
import { toastError } from "@/utils/error.util";

import type { Channel, ChannelRole } from "../api/chat.api";
import type { clientAction } from "../routes/channel.route";

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
	const [errors, setErrors] = useState<ValidationErrors>();
	const fetcher = useFetcher<typeof clientAction>();
	const [showModal, setShowModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [prevFetcherState, setPrevFetcherState] = useState(fetcher.state);

	const [sync, setSync] = useState(edit?.categorySync);
	const promisedRoles: Role[] | Promise<Role[]> = fetchRoles();

	if (prevFetcherState !== fetcher.state) {
		setPrevFetcherState(fetcher.state);
		if (fetcher.state === "idle" && prevFetcherState !== "idle") {
			if (fetcher.data instanceof APIError) {
				setErrors(fetcher.data.problem.errors);
				if (!fetcher.data.problem.errors) {
					toastError(fetcher.data);
				}
			} else {
				setErrors({});
				setShowModal(false);
				setShowDeleteModal(false);
			}
		}
	}

	return (
		<>
			<button
				className={`relative z-1 ml-auto p-0.5 cursor-pointer text-muted hover:text-text ${className}`}
				type="button"
				name="channelForm"
				onClick={() => {
					setShowModal(true);
				}}
			>
				{edit ? <PiGear size={14}></PiGear> : <PiPlus size={14} />}
			</button>

			{showModal &&
				createPortal(
					<Modal
						title={
							edit
								? t("chat.editChannelTitle", {
										name: edit.name,
									})
								: t("chat.createChannelTitle")
						}
						onClose={() => {
							setShowModal(false);
						}}
					>
						{edit ? (
							<p className="text-muted font-main font-light w-4/5 text-sm">
								{t("chat.editChannelHint", {
									name: edit.name,
								})}
							</p>
						) : (
							<p className="text-muted font-main font-light w-4/5 text-sm">
								{t("chat.createChannelHint")}
							</p>
						)}
						<fetcher.Form
							action="/channels"
							method={edit ? "put" : "post"}
							className="flex flex-col items-center w-4/5 gap-5 mb-4"
						>
							<Input
								name="Name"
								label={t("common.name")}
								required
								errors={errors}
								placeholder={t(
									"chat.channelNamePlaceholder",
								)}
								value={edit?.name}
							/>
							<Input
								name="Topic"
								label={t("chat.topic")}
								errors={errors}
								placeholder={t(
									"chat.channelTopicPlaceholder",
								)}
								value={edit?.topic}
							/>
							<Checkbox
								name="Syncronised"
								label={t("chat.synchronised")}
								errors={errors}
								placeholder={t("chat.categorySync")}
								defaultChecked={edit?.categorySync}
								onChange={(ev) => {
									setSync(ev.currentTarget.checked);
								}}
							>
								<p className="text-muted font-main font-light w-4/5 text-sm">
									{t("chat.useCategoryRoles")}
								</p>
							</Checkbox>

							<Promisable
								skeleton={
									<MultipleInput
										name="Roles"
										label={t("common.roles")}
										onlySuggestions
										placeholder={t(
											"chat.whitelistedRoles",
										)}
										errors={errors}
										className="w-full px-2 py-1 font-main"
										grayed={sync}
										values={edit?.rolesWhitelist.map(
											(role: ChannelRole) => role.name,
										)}
									/>
								}
								data={promisedRoles}
							>
								{(roles) => (
									<MultipleInput
										name="Roles"
										label={t("common.roles")}
										onlySuggestions
										suggestions={roles.map(
											(role) => role.name,
										)}
										placeholder={t(
											"chat.whitelistedRoles",
										)}
										errors={errors}
										className="w-full px-2 py-1 font-main"
										grayed={sync}
										values={edit?.rolesWhitelist.map(
											(role: ChannelRole) => role.name,
										)}
									/>
								)}
							</Promisable>
							{edit && (
								<input
									type="hidden"
									name="id"
									defaultValue={edit.id}
								></input>
							)}
							<input
								type="hidden"
								name="category"
								defaultValue={category}
							></input>
							<div className="flex flex-row gap-2">
								<CheckButton
									onClick={() => {
										setShowDeleteModal(true);
									}}
									danger
									pending={fetcher.state !== "idle"}
								>
									{t("common.delete")}
								</CheckButton>
								<CheckButton
									active
									type="submit"
									pending={fetcher.state !== "idle"}
								>
									{edit
										? t("common.validate")
										: t("common.create")}
								</CheckButton>
							</div>
						</fetcher.Form>
					</Modal>,
					document.body,
				)}
			{edit &&
				showDeleteModal &&
				createPortal(
					<Modal
						title={t("chat.deleteChannelTitle", {
							name: edit.name,
						})}
						onClose={() => {
							setShowDeleteModal(false);
						}}
					>
						<fetcher.Form
							action="/channels"
							method="DELETE"
							className="flex flex-row gap-2"
						>
							<input
								type="hidden"
								name="id"
								defaultValue={edit.id}
							></input>
							<CheckButton
								type="submit"
								danger
								pending={fetcher.state !== "idle"}
							>
								{t("common.delete")}
							</CheckButton>
							<CheckButton
								type="button"
								onClick={() => {
									setShowDeleteModal(false);
								}}
								activeCheck={false}
								active
								pending={fetcher.state !== "idle"}
							>
								{t("common.cancel")}
							</CheckButton>
						</fetcher.Form>
					</Modal>,
					document.body,
				)}
		</>
	);
}
