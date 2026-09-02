import type { JSX } from "react";
import { redirect, Form, useLocation } from "react-router";
import { AuthForm, AuthLogo, AuthTitle } from "../components/AuthForm";
import type { Route } from "./+types/register";

interface RegisterInput {
	username: string;
	password: string;
	invitationCode: string;
}

export type UserResult = { ok: true } | { ok: false };

function toUserInput(formData: FormData): RegisterInput {
	return {
		username: formData.get("Username") as string,
		password: formData.get("Password") as string,
		invitationCode: formData.get("Code") as string,
	};
}

async function registerUser(formData: FormData): Promise<UserResult> {
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
	url,
}: Route.ClientActionArgs): Promise<UserResult> {
	const code = url.searchParams.get("invitation");

	if (code === null) {
		return redirect("/login");
	}
	if (!(await registerUser(await request.formData())).ok) {
		return { ok: false };
	}
	return redirect("/");
}

export default function Register(): JSX.Element {
	const location = useLocation();
	const code = new URLSearchParams(location.search).get("invitation");

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
					<AuthForm btnName={"Register"} register code={code} />
				</Form>
			</div>
		</div>
	);
}
