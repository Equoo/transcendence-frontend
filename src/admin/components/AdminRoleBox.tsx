/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type JSX, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";

import { useUser } from "@/users/hooks/users";

import type { Role } from "../api/roles";
import type { clientAction } from "../routes/RolesAction";
import type { Perm } from "./AdminListRoles";

export function RolesBox({
	role,
	perm,
	authorize,
}: {
	role: Role;
	perm: Perm;
	authorize: boolean;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const fetcher = useFetcher<typeof clientAction>();
	const [anim, setAnim] = useState(false);
	const [check, setCheck] = useState<boolean>(
		Boolean(role.permission & perm.code),
	);

	const user = useUser();

	// eslint-disable-next-line no-param-reassign
	authorize &&= Boolean(user!.role.permission & perm.code);

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
				disabled={fetcher.state !== "idle" || !authorize}
				name="perms"
				type="checkbox"
				defaultChecked={Boolean(perm.code & role.permission)}

				className={`checkbox text-accent rounded-sm w-6 h-6 text-2xl ${anim ? "animate-checked" : ""} ${authorize ? "cursor-pointer" : ""} ${check && authorize ? "hover:brightness-110" : "brightness-100"}`}
				onClick={(box) => {
					const isChecked = box.currentTarget.checked;
					setCheck(isChecked);
					setAnim(isChecked);
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
