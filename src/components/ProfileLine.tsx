import type { JSX } from "react";

import type { User } from "../users/api/users.api";
import ProfilePic from "./ProfilePic";

export default function ProfileLine({
	user,
	status = false,
	size = 2,
	edit = false,
	changePicture = false,
}: {
	user: User;
	status?: boolean;
	edit?: boolean;
	changePicture?: boolean;
	size?: 1 | 2 | 3;
}): JSX.Element {
	return (
		<div className="mt-3 flex gap-3 items-center w-full">
			<ProfilePic
				user={user}
				status={status}
				changePicture={changePicture}
				edit={edit}
				size={size}
			/>
			<div className="flex flex-col w-5/10">
				<p className="text-text text-[14px] font-semibold wrap-break-word ">
					{user.userName}
				</p>
				<p className="text-text2 text-[10px] font-medium">
					{user.role.name}
				</p>
			</div>
		</div>
	);
}
