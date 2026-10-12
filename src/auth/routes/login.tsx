import type { JSX } from "react";
import { useTranslation } from "react-i18next";
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
	// eslint-disable-next-line id-length
	const { t } = useTranslation();

	return (
		<div className="flex items-center justify-center w-full h-full bg-back gap-20 login">
			<AuthLogo side={"r"} />
			<div className="flex flex-col w-2/3 h-6/10 justify-center items-end z-10 ">
				<Form method="POST" className="flex flex-col gap-5 ">
					<AuthTitle
						top={t("auth.joinTheTeam")}
						mid={t("auth.loginTitle")}
						bot={t("auth.newInTeam")}
						nameLink={t("auth.signUp")}
						link="/register"
					/>
					{actionData?.ok === false && (
						<div className="text-error">
							{t("auth.invalidLogin")}
						</div>
					)}
					<AuthForm btnName={t("auth.login")} />
				</Form>
			</div>
		</div>
	);
}
