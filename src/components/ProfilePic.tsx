import type { JSX } from "react";
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

export default function ProfilePic({
	user,
	idx = 1,
	className,
}: {
	user: User;
	idx?: number;
	className?: string;
}): JSX.Element {
	const backgroundColor = `#${numberToRGB(hashName(user.userName))}`;

	return (
		<>
			{user.avatar ? (
				<img
					src={`/api/files/${user.avatar.key}`}
					className={`rounded-full w-10 h-10 mt-0.5 ${className}`}
					style={{ zIndex: idx }}
				/>
			) : (
				<div
					className={`w-10 h-10 text-accent-text flex items-center justify-center rounded-full pb-1
					font-semibold text-lg border-3 border-accent-text ${className}`}
					style={{ zIndex: idx, backgroundColor }}
				>
					{user.userName.substring(0, 2)}
				</div>
			)}
		</>
	);
}
