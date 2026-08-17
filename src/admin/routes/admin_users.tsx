/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useState, type JSX } from "react";
import { fetchUsers } from "../api/users";
import ListUsers from "../components/listUsers";
import { PiMagnifyingGlass } from "react-icons/pi";
import type { Route } from "./+types/admin_users";
import { fetchRoles } from "../api/roles";
import ChangeBox from "../components/changebox";
import { APIError, type ProblemDetail } from "../../api/problem_detail";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientLoader() {
	const users = await fetchUsers();
	const roles = await fetchRoles();

	return { users, roles };
}

interface resetInput {
	id: string;
	password: string;
}

function toResetInput(formData: FormData): resetInput {
	return {
		id: formData.get("id") as string,
		password: formData.get("password") as string,
	};
}

async function resetPassword(formdata: FormData): Promise<void> {
	const object = toResetInput(formdata);

	const res = await fetch(`/api/users/${object.id}/password`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(object),
	});

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
}

export async function clientAction({
	request,
}: Route.ClientActionArgs): Promise<void> {
	await resetPassword(await request.formData());
}

export default function AdminUsers({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	const [showChange, setShowChange] = useState<string | null>(null);

	const switchShowChange = (id: string | null): void => {
		if (id !== null) {
			setShowChange(id);
			return;
		}
		setShowChange(null);
	};

	return (
		<div className="w-full h-full bg-back">
			{showChange ? (
				<ChangeBox
					id={showChange}
					switchShowChange={switchShowChange}
				/>
			) : null}
			<div className="flex justify-center flex-row gap-10 w-full h-full">
				<div className="flex flex-col gap-10 w-11/12 my-10">
					<div className="flex justify-between items-center w-full ">
						<h1 className="text-3xl m-4 font-semibold font-head">
							User Management
						</h1>
						<div className="flex gap-10">
							<div className="flex h-10 bg-white border-2 border-border  rounded-md justify-center items-center">
								<input
									className="w-15/16 pl-2.5"
									placeholder="Search User"
								></input>
								<PiMagnifyingGlass className="m-5 size-5"></PiMagnifyingGlass>
							</div>
						</div>
					</div>
					<table className="w-full text-sm font-main text-left text-text">
						<thead className="text-sm text-body bg-surface border-b rounded-base border-border">
							<tr>
								<th
									scope="col"
									className="px-6 py-3 font-semibold text-lg"
								>
									Username
								</th>
								<th
									scope="col"
									className="px-6 py-3 font-semibold text-lg"
								>
									Role
								</th>
								<th
									scope="col"
									className="px-6 py-3 font-semibold text-lg"
								>
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{loaderData.users.map((usr) => (
								<ListUsers
									switchShowChange={switchShowChange}
									key={usr.id}
									user={usr}
									roles={loaderData.roles}
								></ListUsers>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
