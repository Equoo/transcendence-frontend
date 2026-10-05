import { type JSX, useState } from "react";
import { createPortal } from "react-dom";
import { PiGear, PiPlus } from "react-icons/pi";
import { useFetcher } from "react-router";

import { fetchRoles, type Role } from "@/admin/api/roles";
import { APIError, type ValidationErrors } from "@/api/problem_detail";
import CheckButton from "@/components/CheckButton";
import { Input } from "@/components/Input";
import Modal from "@/components/Modal";
import MultipleInput from "@/components/MultipleInput";
import Promisable from "@/components/Promisable";

import type { ChannelCategory, ChannelRole } from "../api/chat.api";
import type { clientAction } from "../routes/channel.route";

export default function CategoryForm({
	edit,
	className,
}: {
	edit?: ChannelCategory | null;
	className?: string;
}): JSX.Element {
	const [errors, setErrors] = useState<ValidationErrors>();
	const fetcher = useFetcher<typeof clientAction>();
	const [showModal, setShowModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [prevFetcherState, setPrevFetcherState] = useState(fetcher.state);

	const promisedRoles: Role[] | Promise<Role[]> = fetchRoles();

	if (prevFetcherState !== fetcher.state) {
		setPrevFetcherState(fetcher.state);
		if (fetcher.data instanceof APIError) {
			setErrors(fetcher.data.problem.errors);
		}
		if (fetcher.state === "idle" && prevFetcherState !== "idle") {
			setShowModal(false);
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
								? `Editing category #${edit.name}`
								: "Create a category"
						}
						onClose={() => {
							setShowModal(false);
						}}
					>
						{edit ? (
							<p className="text-muted font-main font-light w-4/5 text-sm">
								You are editing category #{edit.name}. You can
								change his name and whitelist roles. If roles
								whitelist is empty, everyone can access to
								channel.
							</p>
						) : (
							<p className="text-muted font-main font-light w-4/5 text-sm">
								Creating category, give his name and whitelist
								roles. If roles whitelist is empty, everyone can
								access to channel.
							</p>
						)}
						<fetcher.Form
							action="/category"
							method={edit ? "put" : "post"}
							className="flex flex-col items-center w-4/5 gap-5 mb-4"
						>
							<Input
								name="Name"
								required
								errors={errors}
								placeholder="Category Name"
								defaultValue={edit?.name}
							/>
							<Promisable
								skeleton={
									<MultipleInput
										name="Roles"
										onlySuggestions
										placeholder="Whitelisted Roles"
										errors={errors}
										className="w-full bg-surface border rounded-md border-border2  px-2 py-1 font-main text-text"
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
										onlySuggestions
										suggestions={roles.map(
											(role) => role.name,
										)}
										placeholder="Whitelisted Roles"
										errors={errors}
										className="w-full bg-surface border rounded-md border-border2  px-2 py-1 font-main text-text"
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
							<div className="flex flex-row gap-2">
								<CheckButton
									onClick={() => {
										setShowDeleteModal(true);
									}}
									danger
									pending={fetcher.state !== "idle"}
								>
									Delete
								</CheckButton>
								<CheckButton
									active
									type="submit"
									pending={fetcher.state !== "idle"}
								>
									{edit ? "Validate" : "Create"}
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
						title={`Delete channel #${edit.name}`}
						onClose={() => {
							setShowDeleteModal(false);
						}}
					>
						<fetcher.Form
							action="/category"
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
								Delete
							</CheckButton>
							<CheckButton
								type="button"
								onClick={() => {
									setShowDeleteModal(false);
								}}
								active
								pending={fetcher.state !== "idle"}
							>
								Cancel
							</CheckButton>
						</fetcher.Form>
					</Modal>,
					document.body,
				)}
		</>
	);
}
