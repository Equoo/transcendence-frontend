import { type ComponentProps, type JSX, useEffect, useState } from "react";
import { useFetcher } from "react-router";

import ChangeModal from "@/components/Modal/ChangeModal";
import ChoiceModal from "@/components/Modal/ChoiceModal";
import ProfilePic from "@/components/Profile/ProfilePic";

import type { User } from "../../users/api/users";
import { PermEnum, type Role } from "../api/roles";
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
	const fetcher = useFetcher();

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
		classSelect = "border-0 bg-none bg-surface focus:border-0 focus:ring-0";
	}

	return (
		<tr className="text-sm text-body  border-b rounded-base border-border">
			<td>
				<div className="ml-2">
					<ProfilePic user={user}></ProfilePic>
				</div>
			</td>
			<td className="px-6 py-3 font-medium ">
				{showConfirmationDelete && (
					<ChoiceModal
						title={`Delete ${user.userName} ?`}
						onClose={() => {
							setShowConfirmationDelete(false);
						}}
						action="/users/removeUser"
						method="DELETE"
						desc="The user will be remove from the database. This cannot be cancelled."
						id={user.id}
						fetcher={fetcher}
					></ChoiceModal>
				)}
				{showConfirmationDisconnect && (
					<ChoiceModal
						title={`Disconnect ${user.userName} ?`}
						onClose={() => {
							setShowConfirmationDisconnect(false);
						}}
						action="/users/disconnectUser"
						method="DELETE"
						desc="The user will need to login again. This cannot be
							cancelled."
						id={user.id}
						fetcher={fetcher}
					></ChoiceModal>
				)}
				{showChangePass && (
					<ChangeModal
						title={`Change ${user.userName}'s password`}
						onClose={() => {
							setShowChangePass(false);
						}}
						action="/users/passwordUser"
						method="PATCH"
						desc="The user will need to login again. This cannot be
							cancelled."
						id={user.id}
						inputName="password"
						placeholder="New password"
						minInput={8}
						maxInput={256}
						fetcher={fetcher}
					></ChangeModal>
				)}
				{user.userName}
			</td>
			<td className="px-6 py-3 font-medium">
				<select
					defaultValue={user.role.name}
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
							{ method: "PATCH", action: "/users/roleUser" },
						);
					}}
				>
					{roles.map((rl) => (
						<option key={rl.id}>{rl.name}</option>
					))}
				</select>
			</td>
			<td className="space-x-10 font-medium w-1/4 ">
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
