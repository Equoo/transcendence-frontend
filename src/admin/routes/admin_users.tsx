import { fetchUsers } from "../api/users";
import ListUsers from "../components/listUsers";
import { PiMagnifyingGlass } from "react-icons/pi";
import type { Route } from "./+types/admin_users";
import { fetchRoles } from "../api/roles";
import { APIError, type ProblemDetail } from "../../api/problem_detail";
import List from "../components/list";
import { useEffect, useState, type JSX } from "react";
import CheckButton from "../../components/CheckButton";
import Modal from "../../components/Modal";
import { data, useFetcher } from "react-router";

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

function toResetInput(formData: FormData): resetInput {
	return {
		id: formData.get("id") as string,
		password: formData.get("password") as string,
	};
}

async function resetPassword(formdata: FormData): Promise<Response> {
	const object = toResetInput(formdata);

	const res = await fetch(`/api/auth/${object.id}/password`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(object.password),
	});

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}

	return res;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({ request }: Route.ClientActionArgs) {
	const res = await resetPassword(await request.formData());

	return data(res, { status: 201 });
}

export default function AdminUsers({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	const [showChangePass, setShowChangePass] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [userId, setUserId] = useState<string>("");
	const [userName, setUserName] = useState<string>("");
	const fetcher = useFetcher();

	useEffect(() => {
		if (fetcher.data) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowChangePass(false);
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setUserName("");
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setUserId("");
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowConfirmation(false);
		}
	}, [fetcher.data]);

	return (
		<>
			{showConfirmation && (
				<Modal
					title={`Delete the user ${userName} ?`}
					onClose={() => {
						setShowConfirmation(false);
					}}
				>
					<p className="text-muted font-main font-light w-4/5 text-sm text-center">
						This cannot be cancelled.
					</p>
					<div className="inline-flex gap-8">
						<CheckButton
							pending={fetcher.state !== "idle"}
							onClick={() => {
								void handleRemoveUser(userId);
							}}
						>
							Yes
						</CheckButton>
						<CheckButton
							active
							activeCheck={false}
							onClick={() => {
								setShowConfirmation(false);
							}}
						>
							No
						</CheckButton>
					</div>
				</Modal>
			)}
			{showChangePass && (
				<Modal
					title={`Change ${userName}'s password`}
					onClose={() => {
						setShowChangePass(false);
						setUserName("");
						setUserId("");
					}}
				>
					<fetcher.Form
						className="flex flex-col items-center gap-5"
						method="PATCH"
					>
						<input type="hidden" name="id" value={userId}></input>
						<input
							name="password"
							required
							className="ring-0 focus:border-border border-border rounded-sm"
							type="text"
							placeholder="New Password"
						></input>
						<CheckButton active type="submit">
							OK
						</CheckButton>
					</fetcher.Form>
				</Modal>
			)}
			<div className="w-full h-full bg-back">
				<div className="flex justify-center flex-row gap-10 w-full h-full">
					<div className="flex flex-col gap-10 w-11/12 my-10">
						<div className="flex justify-between items-center w-full ">
							<h1 className="text-3xl m-4 font-semibold font-head">
								User Management
							</h1>
							<div className="flex h-10 bg-white border-2 border-border  rounded-md justify-center items-center">
								<input
									className="w-15/16 pl-2.5"
									placeholder="Search User"
								></input>
								<PiMagnifyingGlass className="m-5 size-5"></PiMagnifyingGlass>
							</div>
						</div>
						<List headers={["Username", "Role", "Actions"]}>
							{loaderData.users.map((usr) => (
								<ListUsers
									setUserName={setUserName}
									setUserId={setUserId}
									setShowChangePass={setShowChangePass}
									setShowConfirmation={setShowConfirmation}
									key={usr.id}
									user={usr}
									roles={loaderData.roles}
								></ListUsers>
							))}
						</List>
					</div>
				</div>
			</div>
		</>
	);
}
