import type { User } from "../../users/api/users.api";
import type { ComponentProps, JSX } from "react";

import type { Role } from "../api/roles";
import { APIError, type ProblemDetail } from "../../api/problem_detail";
export type Props = ComponentProps<"h1"> & {
	className?: string;
};

async function handleChange(
	event: React.ChangeEvent<HTMLSelectElement>,
	Roles: Role[],
	UserId: string,
): Promise<void> {
	let res;

	for (const role of Roles) {
		if (role.name === event.target.value) {
			// eslint-disable-next-line no-await-in-loop
			res = await fetch(`/api/users/${UserId}/role/${role.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!res.ok) {
				// eslint-disable-next-line no-await-in-loop
				throw new APIError((await res.json()) as ProblemDetail);
			}

			break;
		}
	}
}

async function handleRemoveUser(id: string): Promise<Response> {
	const res = await fetch(`/api/users/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}

	window.location.reload();

	return res;
}

async function handleDisconnect(id: string): Promise<Response> {
	const res = await fetch(`/api/auth/logout/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}

	return res;
}

export default function ListUsers({
	user,
	roles,
	setShowChangePass,
	setUserId,
	setUserName,
}: {
	user: User;
	roles: Role[];
	setShowChangePass: React.Dispatch<React.SetStateAction<boolean>>;
	setUserId: React.Dispatch<React.SetStateAction<string>>;
	setUserName: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element {
	return (
		<tr className="text-sm text-body bg-surface border-b rounded-base border-border">
			<td className="px-6 py-3 font-medium ">{user.userName}</td>
			<td className="px-6 py-3 font-medium">
				<select
					className="border-0 bg-surface appearance-none focus:border-0 focus:ring-0 hover:cursor-pointer hover:text-accent"
					onChange={(event) => {
						void handleChange(event, roles, user.id);
					}}
				>
					{roles.map((rl) => (
						<option
							selected={rl.name === user.role.name}
							key={rl.id}
						>
							{rl.name}
						</option>
					))}
				</select>
			</td>
			<td className="space-x-10 w-10/20  px-6 py-3 font-medium">
				<button
					type="submit"
					className="hover:text-accent hover:cursor-pointer"
					onClick={() => void handleRemoveUser(user.id)}
				>
					Remove User
				</button>
				<button
					type="submit"
					className="hover:text-accent hover:cursor-pointer"
					onClick={() => {
						setShowChangePass(true);
						setUserId(user.id);
						setUserName(user.userName);
					}}
				>
					Reset Password
				</button>
				<button
					type="submit"
					className="hover:text-accent hover:cursor-pointer"
					onClick={() => void handleDisconnect(user.id)}
				>
					Disconnect
				</button>
			</td>
		</tr>
	);
}
