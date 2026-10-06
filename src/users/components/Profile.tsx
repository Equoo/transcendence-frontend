import { useEffect, useRef, useState } from "react";
import type { JSX } from "react/jsx-runtime";
import type { FetcherWithComponents } from "react-router";

import type { Role } from "@/admin/api/roles";
import CheckButton from "@/components/Button/CheckButton";
import ChangeModal from "@/components/Modal/ChangeModal";
import ChoiceModal from "@/components/Modal/ChoiceModal";
import ProfileLine from "@/components/Profile/ProfileLine";
import { useClickOutside } from "@/hooks/useClickOutside";
import Section, { type LineInfos } from "@/users/components/Section";

import type { User } from "../api/users";

export default function Profile({
	onClose,
	fetcher,
	user,
	role,
	onClickOutside,
	...rest
}: {
	onClose: () => void;
	fetcher: FetcherWithComponents<Response>;
	user: User;
	role: Role;
	onClickOutside: () => void;
}): JSX.Element {
	const [showDelete, setShowDelete] = useState(false);
	const [showUsername, setShowUsername] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		if (fetcher.data) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowDelete(false);
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowPassword(false);
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowUsername(false);
		}
	}, [fetcher.data]);

	const openUsername = (): void => {
		setShowUsername(true);
	};
	const openPassword = (): void => {
		setShowPassword(true);
	};

	const Lines: LineInfos[] = [
		{
			name: "Username",
			value: user.userName,
			action: openUsername,
		},
		{ name: "Password", value: "***********", action: openPassword },
	];

	const clickOutsideRef = useClickOutside(
		useRef<HTMLDivElement>(null),
		() => {
			if (showDelete || showUsername || showPassword) { return; }
			onClickOutside();
		},
	);

	return (
		<>
			{showDelete && (
				<ChoiceModal
					title="Delete your account ?"
					onClose={() => {
						setShowDelete(false);
					}}
					desc="This cannot be cancelled."
					action="/me/delete"
					method="DELETE"
					fetcher={fetcher}
				></ChoiceModal>
			)}

			{showUsername && (
				<ChangeModal
					title="Change Username"
					onClose={() => {
						setShowUsername(false);
					}}
					action="/me/username"
					method="PATCH"
					inputName="Username"
					placeholder="new Username"
					minInput={1}
					maxInput={20}
					fetcher={fetcher}
				></ChangeModal>
			)}

			{showPassword && (
				<ChangeModal
					title="Change Password"
					onClose={() => {
						setShowPassword(false);
					}}
					action="/me/password"
					method="PATCH"
					inputName="New password"
					minInput={8}
					maxInput={255}
					fetcher={fetcher}
					placeholder="new nassword"
					password
				></ChangeModal>
			)}
			<div
				className="flex items-center justify-center absolute bottom-15 left-55 flex-col border-border2 shadow-md bg-surface w-75 h-90 rounded-2xl z-10"
				ref={clickOutsideRef}
				{...rest}>
				<button
					type="button"
					onClick={onClose}
					className="absolute right-5 top-3  text-muted hover:text-text text-3xl cursor-pointer ml-auto"
				>
					×
				</button>
				<div className="flex flex-col justify-center w-18/21 h-full gap-3 ">
					<ProfileLine
						changePicture
						size={3}
						user={user}
						edit
					></ProfileLine>
					<Section
						role={role}
						title="Account Info"
						lines={Lines}
					></Section>
					<div className="mt-2 flex justify-around gap-5">
						{role.name !== "\\(*-*)/" && (
							<CheckButton
								discrete
								onClick={() => {
									setShowDelete(true);
								}}
							>
								Delete Account
							</CheckButton>
						)}
						<CheckButton
							onClick={() => {
								void fetcher.submit(null, {
									action: "/me/logout",
									method: "DELETE",
								});
							}}
						>
							Logout
						</CheckButton>
					</div>
				</div>
			</div>
		</>
	);
}
