import type { JSX } from "react";
import { redirect, useFetcher } from "react-router";
import type { UserResult } from "./register";
import { AuthForm, AuthLogo, AuthTitle } from "../components/AuthForm";
import type { Route } from "./+types/login";

interface LoginInput {
	username: string;
	password: string;
}

function toLoginInput(formData: FormData): LoginInput {
	return {
		username: formData.get("Username") as string,
		password: formData.get("Password") as string,
	};
}

async function loginUser(formData: FormData): Promise<UserResult> {
	const object = toLoginInput(formData);

	const response = await fetch("/api/auth/login", {
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
}: Route.ClientActionArgs): Promise<UserResult | Response> {
	if (!(await loginUser(await request.formData())).ok) {
		return { ok: false };
	}
	return redirect("/");
}

export default function Login(): JSX.Element {
	const fetcher = useFetcher();

	return (
		<div className="flex items-center justify-center w-full h-full bg-back gap-20">
			<AuthLogo side={"r"} />
			<div className="flex flex-col w-2/3 h-6/10 justify-center items-end z-10 ">
				<fetcher.Form method="POST" className="flex flex-col gap-5 ">
					<AuthTitle
						top="JOIN THE TEAM"
						mid="Login your account"
						bot="New in the team? "
						nameLink="Sign in"
						link="/register"
					/>
					<AuthForm btnName={"Login"} />
				</fetcher.Form>
			</div>
		</div>
	);
}
