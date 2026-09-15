import type { JSX } from "react";

import type { User } from "../users/api/users.api";
import ProfilePic from "./ProfilePic";

export default function ProfileLine({
	user,
	status = false,
	edit = false,
}: {
	user: User;
	status?: boolean;
	edit?: boolean;
}): JSX.Element {
	return (
		<div className="mt-3 flex gap-3 items-center">
			<ProfilePic user={user} status={status} edit={edit} />
			<div className="flex flex-col">
				<div className="text-text font- font-semibold text-lg">
					{user.userName}
				</div>
				<div className="text-text2 text-xs font-medium">
					{user.role.name}
				</div>
			</div>
		</div>
	);
}
