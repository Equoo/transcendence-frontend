/* eslint-disable no-bitwise */
import { type ComponentProps, type JSX, useEffect, useState } from "react";
import { useFetcher } from "react-router";

import HiddenValues from "@/components/HiddenValues";
import { Input } from "@/components/Input";

import CheckButton from "../../components/CheckButton";
import Modal from "../../components/Modal";
import type { User } from "../../users/api/users.api";
import { PermEnum, type Role } from "../api/roles";
import type { clientAction } from "../routes/admin.user.route";
export type Props = ComponentProps<"h1"> & {
	className?: string;
};

export default function ListUsers({
	user,
	roles,
	currentUser,
}: {
	user: User;
	roles: Role[];
	currentUser: User;
}): JSX.Element {
	const [showChangePass, setShowChangePass] = useState(false);
	const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
	const [showConfirmationDisconnect, setShowConfirmationDisconnect] =
		useState(false);
	const fetcher = useFetcher<typeof clientAction>();

	useEffect(() => {
		if (fetcher.data) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowChangePass(false);
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowConfirmationDelete(false);
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowConfirmationDisconnect(false);
		}
	}, [fetcher.data]);

	let classSelect =
		"border-0 bg-surface appearance-none focus:border-0 focus:ring-0 hover:cursor-pointer hover:text-accent";

	if (!(currentUser.role.permission & PermEnum.HandleRoles)) {
		classSelect =
			"border-0  bg-none bg-surface focus:border-0 focus:ring-0";
	}

	return (
		<tr className="text-sm text-body  border-b rounded-base border-border">
			<td className="px-6 py-3 font-medium ">
				{showConfirmationDelete && (
					<Modal
						title={`Delete ${user.userName} ?`}
						onClose={() => {
							setShowConfirmationDelete(false);
						}}
					>
						<p className="text-muted font-main font-light w-4/5 text-sm text-center">
							This cannot be cancelled.
						</p>
						<fetcher.Form
							method="DELETE"
							action="/users"
							className="inline-flex gap-8"
						>
							<HiddenValues
								name="id"
								values={[user.id]}
							></HiddenValues>
							<CheckButton
								type="submit"
								pending={fetcher.state !== "idle"}
							>
								Yes
							</CheckButton>
							<CheckButton
								active
								activeCheck={false}
								onClick={() => {
									setShowConfirmationDelete(false);
								}}
							>
								No
							</CheckButton>
						</fetcher.Form>
					</Modal>
				)}
				{showConfirmationDisconnect && (
					<Modal
						title={`Disconnect ${user.userName} ?`}
						onClose={() => {
							setShowConfirmationDisconnect(false);
						}}
					>
						<p className="text-muted font-main font-light w-4/5 text-sm text-center">
							The user will need to login again. This cannot be
							cancelled.
						</p>
						<fetcher.Form
							method="DELETE"
							action="/users/disconnect"
							className="inline-flex gap-8"
						>
							<HiddenValues
								name="id"
								values={[user.id]}
							></HiddenValues>
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
									setShowConfirmationDisconnect(false);
								}}
							>
								No
							</CheckButton>
						</fetcher.Form>
					</Modal>
				)}
				{showChangePass && (
					<Modal
						title={`Change ${user.userName}'s password`}
						onClose={() => {
							setShowChangePass(false);
						}}
					>
						<fetcher.Form
							className="flex flex-col items-center gap-5"
							method="PATCH"
							action="/users"
						>
							<HiddenValues
								name="id"
								values={[user.id]}
							></HiddenValues>
							<Input
								name="password"
								minLength={8}
								maxLength={256}
								required
								className="ring-0 focus:border-border border-border w-50 rounded-sm"
								type="text"
								placeholder="New Password"
							></Input>
							<CheckButton active type="submit">
								OK
							</CheckButton>
						</fetcher.Form>
					</Modal>
				)}
				{user.userName}
			</td>
			<td className="px-6 py-3 font-medium text-center">
				<select
					disabled={
						!(currentUser.role.permission & PermEnum.HandleRoles)
					}
					className={classSelect}
					onChange={(event) => {
						const role = roles.find(
							(rl) => event.target.value === rl.name,
						);

						if (!role) {
							return;
						}
						void fetcher.submit(
							{
								UserId: user.id,
								RoleId: role.id,
							},
							{ method: "PATCH", action: "/users/disconnect" },
						);
					}}
				>
					{roles.map((rl) => (
						<option
							selected={rl.name === user.role.name}
							key={rl.id}
						>
							{rl.name}
						</option>
					))}
				</select>
			</td>
			<td className="space-x-10 w-10/20  px-6 py-3 font-medium text-center">
				<button
					type="submit"
					className="hover:text-accent hover:cursor-pointer"
					onClick={() => {
						setShowConfirmationDelete(true);
					}}
				>
					Remove User
				</button>
				<button
					type="submit"
					className="hover:text-accent hover:cursor-pointer"
					onClick={() => {
						setShowChangePass(true);
					}}
				>
					Reset Password
				</button>
				<button
					type="submit"
					className="hover:text-accent hover:cursor-pointer"
					onClick={() => {
						setShowConfirmationDisconnect(true);
					}}
				>
					Disconnect
				</button>
			</td>
		</tr>
	);
}
