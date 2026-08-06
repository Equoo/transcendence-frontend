import type { JSX } from "react";
import type { User } from "../../api/users";

export default function ListUsers({ user }: { user: User }): JSX.Element {
	let role = "";

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (user.role !== null) {
		role = user.role.name;
	}

	return (
		<div>
			<h1>
				{user.userName} [{role}]
			</h1>
			<select name="role">
				<option>null</option>
				<option>admin</option>
				<option>modo</option>
				<option>helper</option>
			</select>
		</div>
	);
}
