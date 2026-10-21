import "blobatar/motion.css";

import { Blobatar } from "@blobatar/react";
import { type Expression, idle, sleepy, surprised } from "blobatar/expression";
import { type JSX, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TbPencil } from "react-icons/tb";
import { useFetcher } from "react-router";

import { ActivityEnum, useActivity } from "@/activity/hooks/activity.hook";
import type { User } from "@/users/api/users";

import type { clientAction as filesAction } from "../../files/routes/files.route";
import PopupList from "../List/PopupList";
import AvatarModal from "./AvatarModal";

function getActivityColor(activity: ActivityEnum): string {
	switch (activity) {
		case ActivityEnum.Online:
			return "#23bf08";
		case ActivityEnum.Afk:
			return "#f5b907";
		case ActivityEnum.Busy:
			return "#b83232";
		case ActivityEnum.Offline:
			return "#a8a8a8";
		default:
			return "#0afff7";
	}
}

function getExpression(activity: ActivityEnum): Expression | undefined {
	switch (activity) {
		case ActivityEnum.Online:
			return surprised;
		case ActivityEnum.Afk:
			return sleepy;
		case ActivityEnum.Busy:
			return idle;
		case ActivityEnum.Offline:
			return sleepy;
		default:
			return idle;
	}
}

export default function ProfilePic({
	user,
	idx = 1,
	size = 2,
	className,
	changePicture = false,
	status = false,
	edit = false,
}: {
	user: User;
	size?: 0.5 | 1 | 2 | 3;
	idx?: number;
	className?: string;
	status?: boolean;
	changePicture?: boolean;
	edit?: boolean;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const filesFetcher = useFetcher<typeof filesAction>();
	const fetcher = useFetcher();

	const [showSelect, setShowSelect] = useState(false);
	const [showPics, setShowPics] = useState(false);
	const [showPpMenu, setShowPpMenu] = useState(false);

	useEffect(() => {
		if (filesFetcher.data) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowPics(false);
		}
	}, [filesFetcher.data]);

	useEffect(() => {
		if (fetcher.data) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowPpMenu(false);
		}
	}, [fetcher.data]);

	const activity = useActivity();

	const activities: [ActivityEnum, string][] = [
		[ActivityEnum.Afk, t("activity.afk")],
		[ActivityEnum.Busy, t("activity.busy")],
		[ActivityEnum.Offline, t("activity.offline")],
	];
	let sizeStyle: string;

	if (size === 1) {
		sizeStyle = "w-10 h-10 max-w-10 max-h-10";
	} else if (size === 0.5) {
		sizeStyle = "w-5 h-5 max-w-5 max-h-5";
	} else if (size === 2) {
		sizeStyle = "w-15 h-15 max-w-15 max-h-15";
	} else {
		sizeStyle = "w-18 h-18";
	}

	return (
		<div className={`relative flex shrink-0 ${sizeStyle} ${className}`}>
			{user.avatar ? (
				<img
					src={`/api/files/${user.avatar.key}`}
					className={`rounded-full w-full h-full border-2 border-accent-text`}
					style={{ zIndex: idx }}
				/>
			) : (
				<Blobatar
					name={user.id}
					animate="always"
					className={`w-full h-full`}
					expression={getExpression(activity.getActivity(user.id))}
				></Blobatar>
			)}
			{status && (
				<div
					className="absolute right-0 size-4 shrink-0 aspect-square rounded-full self-end -ml-3 border-3 border-back2"
					style={{
						zIndex: idx + 1,
						backgroundColor: getActivityColor(
							activity.getActivity(user.id),
						),
					}}
				>
					{edit && (
						<div
							className="opacity-0 hover:opacity-100 hover:w-3 hover:h-3 w-full h-full flex items-center justify-center cursor-pointer"
							onClick={() => {
								setShowSelect(true);
							}}
						>
							<TbPencil size={8} className="text-accent-text " />
						</div>
					)}

					{showSelect && (
						<PopupList
							className="bottom-0 left-4 bg-surface2 border border-border"
							onClose={() => {
								setShowSelect(false);
							}}
							rows={[
								{
									id: "online",
									onClick: (): void => {
										activity.removePreference();
									},
									content: (
										<div className="inline-flex gap-2.5 items-center whitespace-nowrap">
											<div
												className="size-3 shrink-0 aspect-square rounded-full"
												style={{
													backgroundColor:
														getActivityColor(
															ActivityEnum.Online,
														),
												}}
											/>
											{t("activity.auto")}
										</div>
									),
								},
								...activities.map(([act, name]) => ({
									id: String(act),
									onClick: (): void => {
										activity.setPreference(act);
									},
									content: (
										<div className="inline-flex gap-2.5 items-center whitespace-nowrap">
											<div
												className="size-3 shrink-0 aspect-square rounded-full"
												style={{
													backgroundColor:
														getActivityColor(act),
												}}
											/>
											{name}
										</div>
									),
								})),
							]}
						/>
					)}
				</div>
			)}
			{changePicture && (
				<div
					onClick={() => {
						if (user.avatar) {
							setShowPpMenu(true);
						} else {
							setShowPics(true);
						}
					}}
					className={` ${sizeStyle} opacity-0 hover:opacity-100 absolute z-1 hover:cursor-pointer rounded-full flex justify-center items-center`}
				>
					<div className="w-full h-full rounded-full bg-black opacity-30"></div>
					<TbPencil
						size={25}
						className="text-accent-text  absolute z-2"
					></TbPencil>
				</div>
			)}
			{showPpMenu && (
				<PopupList
					className="absolute z-4 right-13 top-4  bg-surface2 border border-border"
					onClose={() => {
						setShowPpMenu(false);
					}}
					rows={[
						{
							id: "picture",
							onClick: (): void => {
								setShowPics(true);
							},
							content: (
								<div className="inline-flex gap-2.5 items-center">
									{t("profilePic.choosePicture")}
								</div>
							),
						},
						{
							id: "blobatar",
							onClick: (): void => {
								void fetcher.submit(null, {
									method: "DELETE",
									action: "/me/blobatar",
								});
							},
							content: (
								<div className="inline-flex gap-2.5 items-center">
									{t("profilePic.removeAvatar")}
								</div>
							),
						},
					]}
				></PopupList>
			)}

			{showPics && (
				<AvatarModal
					pending={filesFetcher.state !== "idle"}
					onClose={() => {
						setShowPics(false);
					}}
					onUpload={(file) => {
						const body = new FormData();
						body.set("File", file);
						void filesFetcher.submit(body, {
							method: "PATCH",
							action: "/me/avatar",
							encType: "multipart/form-data",
						});
					}}
				/>
			)}
		</div>
	);
}
