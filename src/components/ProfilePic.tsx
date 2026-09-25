import "blobatar/motion.css";

import { Blobatar } from "@blobatar/react";
import { type Expression, idle, sleepy, surprised } from "blobatar/expression";
import { type JSX, useEffect, useState } from "react";
import { TbPencil } from "react-icons/tb";
import { useFetcher } from "react-router";

import { ActivityEnum, useActivity } from "@/activity/hooks/activity.hook";

import type { clientAction as filesAction } from "../files/routes/files.route";
import type { User } from "../users/api/users.api";
import CheckButton from "./CheckButton";
import { Input } from "./Input";
import Modal from "./Modal";
import PopupList from "./PopupList";

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
	const filesFetcher = useFetcher<typeof filesAction>();

	const [showSelect, setShowSelect] = useState(false);
	const [showPics, setShowPics] = useState(false);

	useEffect(() => {
		if (filesFetcher.data) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowPics(false);
		}
	}, [filesFetcher.data]);

	const activity = useActivity();

	const activities: [ActivityEnum, string][] = [
		[ActivityEnum.Afk, "Afk"],
		[ActivityEnum.Busy, "Busy"],
		[ActivityEnum.Offline, "Offline"],
	];
	let sizeStyle: string;

	if (size === 1) {
		sizeStyle = "w-10 h-10";
	} else if (size === 0.5) {
		sizeStyle = "w-5 h-5";
	} else if (size === 2) {
		sizeStyle = "w-15 h-15";
	} else {
		sizeStyle = "w-20 h-20";
	}

	return (
		<div className={`flex ${sizeStyle}`}>
			{user.avatar ? (
				<img
					src={`/api/files/${user.avatar.key}`}
					className={`rounded-full w-full h-full ${className} border-2 border-accent-text`}
					style={{ zIndex: idx }}
				/>
			) : (
				<Blobatar
					
					name={user.id}
					animate="always"
					className="w-full h-full"
					expression={getExpression(activity.getActivity(user.id))}
				></Blobatar>
			)}
			{status && (
				<div
					className={`absolute left-20 min-w-4 min-h-4 rounded-full self-end -ml-3 border-3 border-back2`}
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
							className="bottom-0 left-4"
							onClose={() => {
								setShowSelect(false);
							}}
							rows={[
								{
									id: "online",
									onClick: (): void => {
										activity.removePreference();
										setShowSelect(false);
									},
									content: (
										<div className="inline-flex gap-2.5 items-center">
											<div
												className={`w-3 h-3 rounded-full `}
												style={{
													backgroundColor:
														getActivityColor(
															ActivityEnum.Online,
														),
												}}
											/>
											Auto
										</div>
									),
								},
								...activities.map(([act, name]) => ({
									id: name,
									onClick: (): void => {
										activity.setPreference(act);
										setShowSelect(false);
									},
									content: (
										<div className="inline-flex gap-2.5 items-center">
											<div
												className={`w-3 h-3 rounded-full `}
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
						setShowPics(true);
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
			{showPics && (
				<Modal
					title="Change profile picture"
					onClose={() => {
						setShowPics(false);
					}}
				>
					<filesFetcher.Form
						method="PATCH"
						encType="multipart/form-data"
						className="flex flex-col items-center w-4/5 gap-5 mb-4"
						action="/me/avatar"
					>
						<Input name="File" type="file" required />
						<CheckButton
							type="submit"
							active
							pending={filesFetcher.state !== "idle"}
						>
							Upload
						</CheckButton>
					</filesFetcher.Form>
				</Modal>
			)}
		</div>
	);
}
