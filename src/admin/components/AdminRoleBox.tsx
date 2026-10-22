import { type JSX, useState } from "react";
import { useFetcher } from "react-router";

import type { Role } from "../api/roles";
import type { Perm } from "./AdminListRoles";

export function RolesBox({
	role,
	perm,
}: {
	role: Role;
	perm: Perm;
}): JSX.Element {
	const fetcher = useFetcher();

	const [anim, setAnim] = useState("");

	return (
		<td className="text-center">
			<input
				disabled={fetcher.state !== "idle"}
				name="perms"
				type="checkbox"
				defaultChecked={Boolean(perm.code & role.permission)}
				className={`accent-accent cursor-pointer size-5 align-middle ${anim} `}
				onClick={(box) => {
					if (box.currentTarget.checked) {
						setAnim("animate-checked");
					} else {
						setAnim("animate-unchecked");
					}
					void fetcher.submit(
						{
							RoleId: role.id,
							RolePerm: role.permission,
							CheckPerm: perm.code,
							IsChecked: box.currentTarget.checked,
						},
						{ method: "PATCH", action: "/roles/checkRole" },
					);
				}}
			></input>
		</td>
	);
}
