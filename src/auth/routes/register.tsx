import type { JSX } from "react";
import { Form, redirect, useLocation } from "react-router";

import { AuthForm, AuthLogo, AuthTitle } from "../../auth/components/AuthForm";
import type { Route } from "../../users/routes/+types/register";
import { registerUser, type UserResult } from "../api/auth";




export async function clientAction({
	request,
}: Route.ClientActionArgs): Promise<UserResult> {
	const formdata = await request.formData();

	if (!(await registerUser(formdata)).ok) {
		return { ok: false };
	}
	return redirect("/");
}

export default function Register({
	actionData,
}: Route.ComponentProps): JSX.Element {
	const location = useLocation();
	const code = new URLSearchParams(location.search).get("invitation");

	return (
		<div className="flex items-center justify-center w-full h-full bg-back gap-20 signup">
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
					{actionData?.ok === false && (
						<div className="text-error">
							Invalid login or password.
						</div>
					)}
					<AuthForm btnName={"Register"} register code={code} />
				</Form>
			</div>
		</div>
	);
}
