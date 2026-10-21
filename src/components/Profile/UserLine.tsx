import type { JSX, ReactNode } from "react";

import type { User } from "@/users/api/users";

import ProfilePic from "./ProfilePic";

export default function UserLine({
	user,
	name,
	subtitle,
	status = true,
}: {
	user: User;
	name?: string;
	subtitle?: ReactNode;
	status?: boolean;
}): JSX.Element {
	return (
		<>
			<ProfilePic user={user} size={1} status={status} />
			<span className="flex flex-1 min-w-0 flex-col">
				<span className="truncate text-sm font-semibold text-text">
					{name ?? user.userName}
				</span>
				{subtitle && (
					<span className="truncate text-xs text-muted">
						{subtitle}
					</span>
				)}
			</span>
		</>
	);
}
