import { useEffect, useRef, useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import type { FetcherWithComponents } from "react-router";

import type { Role } from "@/admin/api/roles";
import CheckButton from "@/components/Button/CheckButton";
import { Input } from "@/components/Input/Input";
import PopupList from "@/components/List/PopupList";
import ChangeModal from "@/components/Modal/ChangeModal";
import ChoiceModal from "@/components/Modal/ChoiceModal";
import Modal, { ModalFooter } from "@/components/Modal/Modal";
import ProfileLine from "@/components/Profile/ProfileLine";
import { useClickOutside } from "@/hooks/useClickOutside";
import Section, { type LineInfos } from "@/users/components/Section";

import { Language, type User } from "../api/users";

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
	// eslint-disable-next-line id-length
	const { i18n, t } = useTranslation();

	const [showDelete, setShowDelete] = useState(false);
	const [showUsername, setShowUsername] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showLanguage, setShowLanguage] = useState(false);

	useEffect(() => {
		if (fetcher.data) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowPassword(false);
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowLanguage(false);
		}
	}, [fetcher.data]);

	const openUsername = (): void => {
		setShowUsername(true);
	};
	const openPassword = (): void => {
		setShowPassword(true);
	};

	const LanguageDisplay: string =
		user.language === Language.fr
			? "Francais"
			: user.language === Language.en
				? "English"
				: "汉语";

	const Lines: LineInfos[] = [
		{
			name: t("profile.username"),
			value: user.userName,
			action: openUsername,
		},
		{
			name: t("profile.password"),
			value: "***********",
			action: openPassword,
		},
		{
			name: t("profile.language"),
			value: LanguageDisplay,
			action: (): void => {
				setShowLanguage(true);
			},
		},
	];

	const clickOutsideRef = useClickOutside(
		useRef<HTMLDivElement>(null),
		() => {
			if (showDelete || showUsername || showPassword) {
				return;
			}
			onClickOutside();
		},
	);

	return (
		<>
			{showDelete && (
				<ChoiceModal
					title={t("profile.deleteTitle")}
					onClose={() => {
						setShowDelete(false);
					}}
					desc={t("common.irreversible")}
					confirmLabel={t("common.delete")}
					action="/me/delete"
					method="DELETE"
				></ChoiceModal>
			)}

			{showUsername && (
				<ChangeModal
					title={t("profile.changeUsername")}
					onClose={() => {
						setShowUsername(false);
					}}
					action="/me/username"
					method="PATCH"
					inputName="Username"
					inputLabel={t("profile.username")}
					placeholder={t("profile.newUsername")}
					minInput={1}
					maxInput={20}
				></ChangeModal>
			)}

			{showPassword && (
				<Modal
					onClose={() => {
						setShowPassword(false);
					}}
					title={t("profile.changePassword")}
					subtitle={t("profile.changePasswordHint")}
				>
					<fetcher.Form
						action="/me/password"
						method="PATCH"
						className="contents"
					>
						<div className="flex flex-col gap-4">
							<Input
								autoFocus
								password
								maxLength={255}
								minLength={8}
								name="Current password"
								label={t("changeModal.currentPassword")}
								required
								placeholder={t(
									"changeModal.currentPasswordPlaceholder",
								)}
							/>
							<Input
								password
								maxLength={255}
								minLength={8}
								name="New password"
								label={t("profile.newPassword")}
								required
								placeholder={t(
									"profile.newPasswordPlaceholder",
								)}
							/>
						</div>
						<ModalFooter>
							<CheckButton
								active
								activeCheck={false}
								type="submit"
								pending={fetcher.state !== "idle"}
							>
								{t("profile.changePassword")}
							</CheckButton>
						</ModalFooter>
					</fetcher.Form>
				</Modal>
			)}
			<div
				className="flex items-center justify-center absolute bottom-15 left-55 flex-col border-border2 shadow-md bg-surface w-75 min-h-95 py-4 rounded-2xl z-10"
				ref={clickOutsideRef}
				{...rest}
			>
				{showLanguage && (
					<PopupList
						className="absolute right-9 bottom-32 bg-surface2 border border-border"
						onClose={() => {
							setShowLanguage(false);
						}}
						rows={[
							{
								id: "Francais",
								onClick: (): void => {
									void fetcher.submit(
										{ language: Language.fr },
										{
											method: "PATCH",
											action: "/me/language",
										},
									);
									void i18n.changeLanguage(
										Language[user.language],
									);
								},
								content: <h1>🇫🇷 | Francais</h1>,
							},
							{
								id: "English",
								onClick: (): void => {
									void fetcher.submit(
										{ language: Language.en },
										{
											method: "PATCH",
											action: "/me/language",
										},
									);
									void i18n.changeLanguage(
										Language[user.language],
									);
								},
								content: <h1>🇬🇧 | English</h1>,
							},
							{
								id: "汉语",
								onClick: (): void => {
									void fetcher.submit(
										{ language: Language.tc },
										{
											method: "PATCH",
											action: "/me/language",
										},
									);
									void i18n.changeLanguage(
										Language[user.language],
									);
								},
								content: <h1>🇹🇼 | 汉语</h1>,
							},
						]}
					></PopupList>
				)}
				<button
					type="button"
					onClick={onClose}
					className="absolute right-5 top-3  text-muted hover:text-text text-3xl cursor-pointer ml-auto"
				>
					×
				</button>
				<div className="flex flex-col justify-center w-18/21 h-full gap-3">
					<ProfileLine
						changePicture
						size={3}
						user={user}
						edit
					></ProfileLine>
					<Section
						role={role}
						title={t("profile.accountInfo")}
						lines={Lines}
					></Section>

					<div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2">
						{role.name !== "\\(*-*)/" && (
							<CheckButton
								discrete
								onClick={() => {
									setShowDelete(true);
								}}
								danger
							>
								{t("profile.deleteAccount")}
							</CheckButton>
						)}
						<CheckButton
							onClick={() => {
								void fetcher.submit(null, {
									action: "/me/logout",
									method: "DELETE",
								});
							}}
							danger
						>
							{t("profile.logout")}
						</CheckButton>
					</div>
				</div>
			</div>
		</>
	);
}
