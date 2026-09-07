/* eslint-disable @eslint-react/no-array-index-key */
import type { JSX } from "react/jsx-runtime";
import { RolesBox } from "./AdminRoleBox";
import type { Role } from "../api/roles";
import { PiTrash } from "react-icons/pi";
import { TbPencil } from "react-icons/tb";
import Modal from "../../components/Modal";
import { useFetcher } from "react-router";
import CheckButton from "../../components/CheckButton";
import { useEffect, useState } from "react";

export interface Perm {
	name: string;
	code: number;
}

export default function ListRoles({ role }: { role: Role }): JSX.Element {
	const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
	const [showChangeRole, setShowChangeRole] = useState<boolean>(false);

	const fetcher = useFetcher();

	useEffect(() => {
		if (fetcher.data) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowConfirmation(false);
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowChangeRole(false);
		}
	}, [fetcher.data]);

	const checkboxes: Perm[] = [
		{ name: "isAdmin", code: 1 },
		{ name: "HandleEvent", code: 2 },
		{ name: "GetUser", code: 4 },
		{ name: "InviteUser", code: 8 },
		{ name: "ChangeUsername", code: 16 },
		{ name: "DeleteUser", code: 32 },
		{ name: "ResetPassword", code: 64 },
		{ name: "HandleChannel", code: 128 },
	];

	return (
		<tr className="text-sm text-body border-b rounded-base border-border h-full">
			<td className="px-6 font-medium py-5">
				{showChangeRole && (
					<Modal
						title={`Change role's name`}
						onClose={() => {
							setShowChangeRole(false);
						}}
					>
						<fetcher.Form
							className="flex flex-col items-center gap-5"
							method="PATCH"
							action="/roles"
						>
							<input
								type="hidden"
								name="id"
								value={role.id}
							></input>
							<input
								name="name"
								required
								className="ring-0 focus:border-border border-border rounded-sm"
								type="text"
								placeholder="New Name"
							></input>
							<CheckButton active type="submit">
								OK
							</CheckButton>
						</fetcher.Form>
					</Modal>
				)}
				{showConfirmation && (
					<Modal
						title={`Delete the role ?`}
						onClose={() => {
							setShowConfirmation(false);
						}}
					>
						<p className="text-muted font-main font-light w-4/5 text-sm text-center">
							All users using this role will become member
							instead. This cannot be cancelled.
						</p>
						<fetcher.Form
							method="DELETE"
							className="inline-flex gap-8"
							action="/roles"
						>
							<input
								type="hidden"
								name="id"
								value={role.id}
							></input>
							<CheckButton
								pending={fetcher.state !== "idle"}
								type="submit"
							>
								Yes
							</CheckButton>
							<CheckButton
								active
								activeCheck={false}
								onClick={() => {
									setShowConfirmation(false);
								}}
							>
								No
							</CheckButton>
						</fetcher.Form>
					</Modal>
				)}
				{role.name}
			</td>
			{checkboxes.map((check, index) => (
				<RolesBox role={role} perm={check} key={index}></RolesBox>
			))}
			<td className="flex flex-row items-center justify-between w-full h-full px-6 py-3 ">
				<TbPencil
					size={26}
					color="var(--color-text2)"
					className={`cursor-pointer hover:animate-rotate`}
					onClick={() => {
						setShowChangeRole(true);
					}}
				/>
				{role.name !== "Member" && (
					<PiTrash
						size={26}
						color="var(--color-text2)"
						className="hover:cursor-pointer"
						onClick={() => {
							setShowConfirmation(true);
						}}
					/>
				)}
			</td>
		</tr>
	);
}
