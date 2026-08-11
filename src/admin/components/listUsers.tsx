import type { User } from "../../api/users";
import type { ComponentProps, JSX } from "react";
import type { Role } from "../api/roles";
import type React from "react";

export type Props = ComponentProps<"h1"> & {
	className?: string;
};

function handleChange(
	e: React.ChangeEvent<HTMLInputElement>,
	Roles: Role[],
	UserId: string,
): void {
	let id = "" as string;

	for (const role of Roles) {
		if (role.name === e.target.value) {
			id = role.id;
		}
	}

	const res = fetch(`/api/roles/give/${UserId}/${id}`, {
		method: "POST",
	});
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
				<select onChange={(e) => handleChange(e, roles, user.id)}>
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
