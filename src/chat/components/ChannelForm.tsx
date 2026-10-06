import { type JSX, useState } from "react";
import { createPortal } from "react-dom";
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
	const [errors, setErrors] = useState<ValidationErrors>();
	const fetcher = useFetcher<typeof clientAction>();
	const [showModal, setShowModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [prevFetcherState, setPrevFetcherState] = useState(fetcher.state);

	const [sync, setSync] = useState(edit?.categorySync);
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
								? `Editing channel #${edit.name}`
								: "Create a channel"
						}
						onClose={() => {
							setShowModal(false);
						}}
					>
						{edit ? (
							<p className="text-muted font-main font-light w-4/5 text-sm">
								You are editing channel #{edit.name}. You can
								change his name, topic and whitelist roles. If
								roles whitelist is empty, everyone can access to
								channel.
							</p>
						) : (
							<p className="text-muted font-main font-light w-4/5 text-sm">
								Creating channel, give his name, topic and
								whitelist roles. If roles whitelist is empty,
								everyone can access to channel.
							</p>
						)}
						<fetcher.Form
							action="/channels"
							method={edit ? "put" : "post"}
							className="flex flex-col items-center w-4/5 gap-5 mb-4"
						>
							<Input
								name="Name"
								required
								errors={errors}
								placeholder="Channel Name"
								value={edit?.name}
							/>
							<Input
								name="Topic"
								errors={errors}
								placeholder="Channel Topic"
								value={edit?.topic}
							/>
							<Checkbox
								name="Syncronised"
								errors={errors}
								placeholder="Category Sync"
								defaultChecked={edit?.categorySync}
								onChange={(ev) => {
									setSync(ev.currentTarget.checked);
								}}
							>
								<p className="text-muted font-main font-light w-4/5 text-sm">
									Use category roles whitelist for this
									channel.
								</p>
							</Checkbox>

							<Promisable
								skeleton={
									<MultipleInput
										name="Roles"
										onlySuggestions
										placeholder="Whitelisted Roles"
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
										onlySuggestions
										suggestions={roles.map(
											(role) => role.name,
										)}
										placeholder="Whitelisted Roles"
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
								Delete
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
								Cancel
							</CheckButton>
						</fetcher.Form>
					</Modal>,
					document.body,
				)}
		</>
	);
}
