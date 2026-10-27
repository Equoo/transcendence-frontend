import { type JSX, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";

import type { Role } from "../api/roles";
import type { clientAction } from "../routes/RolesAction";
import type { Perm } from "./AdminListRoles";

export function RolesBox({
	role,
	perm,
}: {
	role: Role;
	perm: Perm;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const fetcher = useFetcher<typeof clientAction>();
	const [check, setCheck] = useState<boolean>(
		Boolean(role.permission & perm.code),
	);

	useEffect(() => {
		if (fetcher.data && fetcher.state === "idle") {
			toast.success(
				t(
					fetcher.data.status === 201
						? "admin.permissionGranted"
						: "admin.permissionRevoked",
					{
						perm: t(`permissions.${perm.name}`),
						role: role.name,
					},
				),
			);
		}
	}, [fetcher.data, fetcher.state, perm.name, role.name, t]);

	return (
		<td className="text-center">
			<input
				disabled={fetcher.state !== "idle"}
				name="perms"
				type="checkbox"
				defaultChecked={Boolean(perm.code & role.permission)}
				className={`checkbox text-accent cursor-pointer rounded-sm w-6 h-6 text-2xl ${check ? "animate-checked hover:brightness-110" : "animate-unchecked"}`}
				onClick={(box) => {
					const isChecked = box.currentTarget.checked;
					setCheck(isChecked);
					void fetcher.submit(
						{
							RoleId: role.id,
							RolePerm: role.permission,
							CheckPerm: perm.code,
							IsChecked: isChecked,
						},
						{ method: "PATCH", action: "/roles/checkRole" },
					);
				}}
			></input>
		</td>
	);
}
