import { type JSX, useRef, useState } from "react";
import { TbPencil } from "react-icons/tb";

import { ActivityEnum, useActivity } from "@/activity/hooks/activity.hook";
import { useClickOutside } from "@/hooks/useClickOutside";

import type { User } from "../users/api/users.api";

function hashName(name: string): number {
	let hash = 0;

	for (let idx = 0; idx < name.length; idx += 1) {
		// eslint-disable-next-line no-bitwise
		hash = name.charCodeAt(idx) + ((hash << 5) - hash);
	}
	return hash;
}

function numberToRGB(num: number): string {
	// eslint-disable-next-line no-bitwise
	const col = (num & 0x00ffffff).toString(16).toLowerCase();

	return "00000".substring(0, 6 - col.length) + col;
}

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

export default function ProfilePic({
	user,
	idx = 1,
	size = 10,
	className,
	status = false,
	edit = false,
}: {
	user: User;
	size?: number;
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

	const backgroundColor = `#${numberToRGB(hashName(user.userName))}`;
	const activities: [ActivityEnum, string][] = [
		[ActivityEnum.Afk, "Afk"],
		[ActivityEnum.Busy, "Busy"],
		[ActivityEnum.Offline, "Offline"],
	];

	return (
		<div className="flex">
			{user.avatar ? (
				<img
					src={`/api/files/${user.avatar.key}`}
					className={`rounded-full w-${size} h-${size} mt-0.5 ${className} border-2 border-accent-text`}
					style={{ zIndex: idx }}
				/>
			) : (
				<div
					className={`w-${size} h-${size} text-accent-text flex items-center justify-center rounded-full pb-1
					font-semibold text-lg border-2 border-accent-text ${className}`}
					style={{ zIndex: idx, backgroundColor }}
				>
					{user.userName.substring(0, 2)}
				</div>
			)}
			{status && (
				<div
					className={`w-4 h-4 rounded-full self-end -ml-3 border-3 border-back2`}
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
