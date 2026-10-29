import { type ComponentProps, type JSX, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";

import { Select } from "@/components/Input/Select";
import { ListCell, ListRow } from "@/components/List/List";
import ChangeModal from "@/components/Modal/ChangeModal";
import ChoiceModal from "@/components/Modal/ChoiceModal";
import ProfilePic from "@/components/Profile/ProfilePic";
import Promisable from "@/components/Promisable";

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
	roles: Role[] | Promise<Role[]>;
	currentUser: User;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [showChangePass, setShowChangePass] = useState(false);
	const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
	const [showConfirmationDisconnect, setShowConfirmationDisconnect] =
		useState(false);
	const fetcher = useFetcher();

	const canHandleRoles =
		(currentUser.role.permission & PermEnum.HandleRoles) !== 0;
	const isSelf = currentUser.id === user.id;
	// On ne peut changer le rôle que d'un utilisateur strictement en dessous de soi
	const canEditUserRole =
		canHandleRoles &&
		!isSelf &&
		user.role.ranking > currentUser.role.ranking;

	return (
		<>
			{showConfirmationDelete && (
				<ChoiceModal
					title={t("admin.deleteUserTitle", {
						name: user.userName,
					})}
					onClose={() => {
						setShowConfirmationDelete(false);
					}}
					action="/users/removeUser"
					method="DELETE"
					desc={t("admin.deleteUserDesc")}
					confirmLabel={t("common.delete")}
					id={user.id}
				></ChoiceModal>
			)}
			{showConfirmationDisconnect && (
				<ChoiceModal
					title={t("admin.disconnectTitle", {
						name: user.userName,
					})}
					onClose={() => {
						setShowConfirmationDisconnect(false);
					}}
					action="/users/disconnectUser"
					method="DELETE"
					desc={t("admin.reloginDesc")}
					confirmLabel={t("admin.disconnect")}
					id={user.id}
				></ChoiceModal>
			)}
			{showChangePass && (
				<ChangeModal
					password
					title={t("admin.changePasswordTitle", {
						name: user.userName,
					})}
					onClose={() => {
						setShowChangePass(false);
					}}
					action="/users/passwordUser"
					method="PATCH"
					desc={t("admin.reloginDesc")}
					id={user.id}
					inputName="password"
					inputLabel={t("profile.password")}
					placeholder={t("profile.newPassword")}
					minInput={8}
					maxInput={256}
				></ChangeModal>
			)}

			<ListRow className="text-sm text-body  border-b rounded-base border-border">
				<ListCell pp>
					<ProfilePic size={2} user={user}></ProfilePic>
				</ListCell>
				<ListCell pp>{user.userName}</ListCell>
				<ListCell pp>
					<Promisable data={roles}>
						{(listRole) =>
							canEditUserRole ? (
								<Select
									defaultValue={user.role.name}
									ghost
									options={listRole
										.filter(
											(rl) =>
												rl.ranking >
												currentUser.role.ranking,
										)
										.map((rl) => ({
											value: rl.name,
											label: rl.name,
										}))}
									onChange={(value) => {
										const role = listRole.find(
											(rl) => value === rl.name,
										);

										if (!role) {
											return;
										}
										void fetcher
											.submit(
												{
													UserId: user.id,
													RoleId: role.id,
												},
												{
													method: "PATCH",
													action: "/users/roleUser",
												},
											)
											.then(() => {
												toast.success(
													t("admin.userRoleChanged", {
														name: user.userName,
														role: role.name,
													}),
												);
											});
									}}
								/>
							) : (
								<h1>{user.role.name}</h1>
							)
						}
					</Promisable>
				</ListCell>
				<ListCell pp>
					<div className="flex flex-wrap items-center gap-x-6 ">
						<button
							type="submit"
							className="whitespace-nowrap hover:text-accent hover:cursor-pointer"
							onClick={() => {
								setShowConfirmationDelete(true);
							}}
						>
							{t("admin.removeUser")}
						</button>
						<button
							type="submit"
							className="whitespace-nowrap hover:text-accent hover:cursor-pointer"
							onClick={() => {
								setShowChangePass(true);
							}}
						>
							{t("admin.resetPassword")}
						</button>
						<button
							type="submit"
							className="whitespace-nowrap hover:text-accent hover:cursor-pointer"
							onClick={() => {
								setShowConfirmationDisconnect(true);
							}}
						>
							{t("admin.disconnect")}
						</button>
					</div>
				</ListCell>
			</ListRow>
		</>
	);
}
