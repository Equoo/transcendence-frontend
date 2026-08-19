import type { JSX } from "react";
import { redirect, Form } from "react-router";
import { AuthForm, AuthLogo, AuthTitle } from "../components/AuthForm";
import type { Route } from "./+types/register";

interface RegisterInput {
	username: string;
	password: string;
	invitationCode: string;
}

export type UserResult = { ok: true } | { ok: false };

function toUserInput(formData: FormData, code: string): RegisterInput {
	return {
		username: formData.get("username") as string,
		password: formData.get("password") as string,
		invitationCode: code,
	};
}

async function registerUser(
	formData: FormData,
	code: string,
): Promise<UserResult> {
	const object = toUserInput(formData, code);

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
	if (!(await registerUser(await request.formData(), code)).ok) {
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
