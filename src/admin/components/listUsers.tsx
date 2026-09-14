import type React from "react";
import type { ComponentProps, JSX } from "react";

import { APIError, type ProblemDetail } from "../../api/problem_detail";
import {
	ListAction,
	ListActions,
	ListCell,
	ListRow,
} from "../../components/List";
import type { User } from "../../users/api/users.api";
import type { Role } from "../api/roles";
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
	setShowConfirmation,
	setUserId,
	setUserName,
}: {
	user: User;
	roles: Role[];
	setShowChangePass: React.Dispatch<React.SetStateAction<boolean>>;
	setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
	setUserId: React.Dispatch<React.SetStateAction<string>>;
	setUserName: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element {
	return (
		<ListRow>
			<ListCell rowHeader>{user.userName}</ListCell>
			<ListCell pos="text-center">
				<select
					aria-label={`Role for ${user.userName}`}
					defaultValue={user.role.name}
					className="border-0 bg-surface appearance-none focus:border-0 focus:ring-0 hover:cursor-pointer hover:text-accent"
					onChange={(event) => {
						void handleChange(event, roles, user.id);
					}}
				>
					{roles.map((rl) => (
						<option key={rl.id}>{rl.name}</option>
					))}
				</select>
			</ListCell>
			<ListCell>
				<ListActions>
					<ListAction
						onClick={() => {
							setShowConfirmation(true);
							setUserId(user.id);
							setUserName(user.userName);
						}}
					>
						Remove User
					</ListAction>
					<ListAction
						onClick={() => {
							setShowChangePass(true);
							setUserId(user.id);
							setUserName(user.userName);
						}}
					>
						Reset Password
					</ListAction>
					<ListAction onClick={() => void handleDisconnect(user.id)}>
						Disconnect
					</ListAction>
				</ListActions>
			</ListCell>
		</ListRow>
	);
}
