import type { JSX } from "react";
import { PiSignOut } from "react-icons/pi";
import { useFetcher } from "react-router";

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
	const fetcher = useFetcher();
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
			<PiSignOut
				className="mr-5 text-muted hover:cursor-pointer hover:text-accent"
				size={20}
				onClick={() => {
					void fetcher.submit(null, {
						method: "DELETE",
						action: "/",
					});
				}}
			></PiSignOut>
		</div>
	);
}
