/* eslint-disable no-undefined */
import "blobatar/motion.css";

import { Blobatar } from "@blobatar/react";
import { type Expression, idle, sleepy, surprised } from "blobatar/expression";
import { type JSX, useRef, useState } from "react";
import { TbPencil } from "react-icons/tb";

import { ActivityEnum, useActivity } from "@/activity/hooks/activity.hook";
import { useClickOutside } from "@/hooks/useClickOutside";

import type { User } from "../users/api/users.api";

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
	status = false,
	edit = false,
}: {
	user: User;
	size?: 0.5 | 1 | 2 | 3;
	idx?: number;
	className?: string;
	status?: boolean;
	edit?: boolean;
}): JSX.Element {
	const [showSelect, setShowSelect] = useState(false);
	const clickOutsideRef = useClickOutside(
		useRef<HTMLUListElement>(null),
		() => {
			setShowSelect(false);
		},
	);
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
	const [editPic, setEditPic] = useState(false);

	return (
		<div className={`flex ${sizeStyle}`}>
			{user.avatar ? (
				<img
					src={`/api/files/${user.avatar.key}`}
					className={`rounded-full w-7/10 h-7/10 mt-0.5 ${className} border-2 border-accent-text ${sizeStyle}`}
					style={{ zIndex: idx }}
				/>
			) : (
				<>
					<Blobatar
						name={user.userName}
						animate="always"
						className="w-full h-full"
						expression={getExpression(
							activity.getActivity(user.id),
						)}
					></Blobatar>
					{editPic && edit && (
						<div
							onMouseLeave={() => {
								setEditPic(false);
							}}
							className={`cursor-pointer bg-slate-400/60  absolute z-1  text-accent-text flex items-center justify-center rounded-full pb-1
                        font-semibold text-lg border-2 border-accent-text ${className}`}
						>
							<TbPencil size={30}></TbPencil>
						</div>
					)}
				</>
			)}
			{status && (
				<div
					className={`min-w-4 min-h-4 rounded-full self-end -ml-3 border-3 border-back2`}
					style={{
						zIndex: idx + 1,
						backgroundColor: getActivityColor(
							activity.getActivity(user.id),
						),
					}}
				>
					{edit && (
						<div
							className="opacity-0 hover:opacity-100 w-full h-full flex items-center justify-center cursor-pointer"
							onClick={() => {
								setShowSelect(true);
							}}
						>
							<TbPencil size={8} />
						</div>
					)}
					{showSelect && (
						<ul
							ref={clickOutsideRef}
							className="absolute bottom-4 p-2 ml-4 bg-back rounded-md flex flex-col"
						>
							<li
								onClick={() => {
									activity.removePreference();
									setShowSelect(false);
								}}
								className="inline-flex gap-2.5 items-center p-1 hover:bg-back2 rounded-md cursor-pointer"
							>
								<div
									className={`w-3 h-3 rounded-full `}
									style={{
										backgroundColor: getActivityColor(
											ActivityEnum.Online,
										),
									}}
								/>
								Auto
							</li>
							{activities.map(([act, name]) => (
								<li
									key={act}
									onClick={() => {
										activity.setPreference(act);
										setShowSelect(false);
									}}
									className="inline-flex gap-2.5 items-center p-1 hover:bg-back2 rounded-md cursor-pointer"
								>
									<div
										className={`w-3 h-3 rounded-full `}
										style={{
											backgroundColor:
												getActivityColor(act),
										}}
									/>
									{name}
								</li>
							))}
						</ul>
					)}
				</div>
			)}
		</div>
	);
}
