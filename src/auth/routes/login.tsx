import type { JSX } from "react";
import { Form, redirect } from "react-router";

import { AuthForm, AuthLogo, AuthTitle } from "../../auth/components/AuthForm";
import { loginUser, type UserResult } from "../api/auth";
import type { Route } from "./+types/login";

export async function clientAction({
	request,
}: Route.ClientActionArgs): Promise<UserResult | Response> {
	const formdata = await request.formData();

	if (!(await loginUser(formdata)).ok) {
		return { ok: false };
	}
	return redirect("/");
}

export default function Login({
	actionData,
}: Route.ComponentProps): JSX.Element {
	return (
		<div className="flex items-center justify-center w-full h-full bg-back gap-20 login">
			<AuthLogo side={"r"} />
			<div className="flex flex-col lg:w-2/3 h-6/10 justify-center z-10 items-center lg:items-end">
				<Form
					method="POST"
					className="flex flex-col gap-5 items-center lg:items-start"
				>
					<AuthTitle
						top="JOIN THE TEAM"
						mid="Login your account"
						bot="New in the team? "
						nameLink="Sign up"
						link="/register"
					/>
					{actionData?.ok === false && (
						<div className="text-error">
							Invalid login or password.
						</div>
					)}
					<AuthForm btnName={"Login"} />
				</Form>
			</div>
		</div>
	);
}
