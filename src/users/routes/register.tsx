import type { JSX } from "react";
import { redirect, Form } from "react-router";
import { AuthForm, AuthLogo, AuthTitle } from "../components/AuthForm";
import type { Route } from "./+types/register";

export interface UserInput {
	username: string;
	password: string;
}

export type UserResult = { ok: true } | { ok: false };

export function toUserInput(formData: FormData): UserInput {
	return {
		username: formData.get("username") as string,
		password: formData.get("password") as string,
	};
}

export async function registerUser(formData: FormData): Promise<UserResult> {
	const object = toUserInput(formData);

	const response = await fetch("/api/auth/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(object),
	});

	if (!response.ok) {
		return { ok: false };
	}
	return { ok: true };
}

export async function clientAction({
	request,
}: Route.ClientActionArgs): Promise<UserResult> {
	if (!(await registerUser(await request.formData())).ok) {
		return { ok: false };
	}
	return redirect("/");
}

export default function Register(): JSX.Element {
	return (
		<div className="flex items-center justify-center w-full h-full bg-back gap-20">
			<AuthLogo side={"l"} />
			<div className="flex flex-col w-2/3 h-6/10 justify-center items-start z-10 ">
				<Form method="POST" className="flex flex-col gap-5 ">
					<AuthTitle
						top="JOIN THE TEAM"
						mid="Create new account"
						bot="Already a member? "
						nameLink="Log in"
						link="/login"
					/>
					<AuthForm btnName={"Register"} />
				</Form>
			</div>
		</div>
	);
}
