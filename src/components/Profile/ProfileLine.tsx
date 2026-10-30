import type { JSX } from "react";

import type { User } from "@/users/api/users";

import ProfilePic from "./ProfilePic";

export default function ProfileLine({
	user,
	status = false,
	size = 2,
	edit = false,
	watch = false,
	changePicture = false,
}: {
	user: User;
	status?: boolean;
	edit?: boolean;
	changePicture?: boolean;
	watch?: boolean;
	size?: 1 | 2 | 3;
}): JSX.Element {
	return (
		<div className="flex gap-3 items-center w-full">
			<ProfilePic
				user={user}
				status={status}
				changePicture={changePicture}
				edit={edit}
				watch={watch}
				size={size}
			/>
			<div className="flex min-w-0 flex-col whitespace-nowrap w-4/7 ">
				<p className="text-text text-[14px] font-semibold wrap-break-word truncate ">
					{user.userName}
				</p>
				<p className="text-text2 text-2xs font-medium truncate">
					{user.role.name}
				</p>
			</div>
		</div>
	);
}
