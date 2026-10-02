import { type JSX, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PiGear, PiPlus } from "react-icons/pi";
import { useFetcher } from "react-router";

import { fetchRoles, type Role } from "@/admin/api/roles";
import { APIError, type ValidationErrors } from "@/api/problem_detail";
import CheckButton from "@/components/CheckButton";
import { Input } from "@/components/Input";
import Modal from "@/components/Modal";
import MultipleInput from "@/components/MultipleInput";

import type { Channel, ChannelRole } from "../api/chat.api";
import type { clientAction } from "../routes/channel.route";

export default function ChannelForm({
	edit,
	className,
}: {
	edit?: Channel | null;
	className?: string;
}): JSX.Element {
	const [errors, setErrors] = useState<ValidationErrors>();
	const fetcher = useFetcher<typeof clientAction>();
	const [showModal, setShowModal] = useState(false);
	const [prevFetcherState, setPrevFetcherState] = useState(fetcher.state);

	if (prevFetcherState !== fetcher.state) {
		setPrevFetcherState(fetcher.state);
		if (fetcher.data instanceof APIError) {
			setErrors(fetcher.data.problem.errors);
		}
		if (fetcher.state === "idle" && prevFetcherState !== "idle") {
			setShowModal(false);
		}
	}

	const [roles, setRoles] = useState<Role[]>([]);

	useEffect(() => {
		const fetch = async (): Promise<void> => {
			const rolesInner = await fetchRoles();
			setRoles(rolesInner);
		};
		if (showModal && roles.length === 0) {
			void fetch();
			// .TODO: Very weak, upgrade it
		}
	}, [roles.length, showModal]);

	return (
		<>
			<button
				className={`relative z-1 ml-auto p-0.5 cursor-pointer text-muted hover:text-text ${className}`}
				type="button"
				name="categoryForm"
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
							action="/category"
							method={edit ? "put" : "post"}
							className="flex flex-col items-center w-4/5 gap-5 mb-4"
						>
							<Input
								name="Name"
								required
								errors={errors}
								placeholder="Category Name"
								value={edit?.name}
							/>
							<MultipleInput
								name="Roles"
								onlySuggestions
								suggestions={roles.map((role) => role.name)}
								placeholder="Whitelisted Roles"
								errors={errors}
								className="w-full bg-surface border rounded-md border-border2  px-2 py-1 font-main text-text"
								values={edit?.rolesWhitelist.map(
									(role: ChannelRole) => role.name,
								)}
							/>
							{edit && (
								<input
									className="hidden"
									type="text"
									name="id"
									value={edit.id}
								></input>
							)}
							<div className="flex flex-row gap-2">
								<CheckButton
									active
									type="submit"
									pending={fetcher.state !== "idle"}
								>
									{edit ? "Validate" : "Create"}
								</CheckButton>
							</div>
						</fetcher.Form>
						{edit && (
							<fetcher.Form
								action="/channels"
								method="DELETE"
								className=""
							>
								<input
									className="hidden"
									type="text"
									name="id"
									value={edit.id}
								></input>
								<CheckButton
									type="submit"
									pending={fetcher.state !== "idle"}
								>
									Delete
								</CheckButton>
							</fetcher.Form>
						)}
					</Modal>,
					document.body,
				)}
		</>
	);
}
