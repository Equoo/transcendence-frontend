import type { User } from "../../api/users";
import type { ComponentProps, JSX } from "react";
import type { Role } from "../api/roles";
import type React from "react";
import { APIError, type ProblemDetail } from "../../api/problem_detail";

export type Props = ComponentProps<"h1"> & {
	className?: string;
};

async function handleChange(
	event: React.ChangeEvent<HTMLSelectElement>,
	Roles: Role[],
	UserId: string,
): Promise<void> {
	for (const role of Roles) {
		if (role.name === event.target.value) {
			// eslint-disable-next-line no-await-in-loop
			const res = await fetch(`/api/roles/give/${UserId}/${role.id}`, {
				method: "POST",
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

export default function ListUsers({
	user,
	roles,
}: {
	user: User;
	roles: Role[];
}): JSX.Element {
	return (
		<tr>
			<td>{user.userName}</td>
			<td>
				<select
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
		</tr>
	);
}
