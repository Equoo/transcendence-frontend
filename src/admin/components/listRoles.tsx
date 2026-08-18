import type { JSX } from "react/jsx-runtime";
import { RolesBox } from "./checkbox";
import { useFetcher } from "react-router";
import type { Role } from "../api/roles";

export interface Perm {
	name: string;
	code: number;
}

export default function ListRoles({ role }: { role: Role }): JSX.Element {
	const fetcher = useFetcher();

	const checkboxes: Perm[] = [
		{ name: "isAdmin", code: 1 },
		{ name: "HandleEvent", code: 2 },
		{ name: "GetUser", code: 4 },
		{ name: "InviteUser", code: 8 },
		{ name: "ChangeUsername", code: 16 },
		{ name: "DeleteUser", code: 32 },
		{ name: "ResetPassword", code: 64 },
		{ name: "HandleChannel", code: 128 },
	];

	return (
		<tr className="text-sm text-body bg-surface border-b rounded-base border-border">
			<td className="px-6 py-3 font-medium">{role.name}</td>
			<td className="flex w-10/20  px-6 py-3 font-medium">
				<fetcher.Form className="flex">
					{checkboxes.map((check) => (
						<RolesBox
							key={role.id}
							role={role}
							perm={check}
						></RolesBox>
					))}
				</fetcher.Form>
			</td>
		</tr>
	);
}
