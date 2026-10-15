import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { Form, redirect, useLocation } from "react-router";

import { AuthForm, AuthLogo, AuthTitle } from "../../auth/components/AuthForm";
import { registerUser, type UserResult } from "../api/auth";
import type { Route } from "./+types/register";

export async function clientAction({
	request,
}: Route.ClientActionArgs): Promise<UserResult | Response> {
	const formdata = await request.formData();
	const res = await registerUser(formdata);

	if (!res.ok) {
		return res;
	}
	return redirect("/");
}

export default function Register({
	actionData,
}: Route.ComponentProps): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const location = useLocation();
	const code = new URLSearchParams(location.search).get("invitation");

	return (
		<div className="flex items-center justify-center w-full h-full bg-back gap-20 signup">
			<AuthLogo side={"l"} />
			<div className="flex flex-col lg:w-2/3 h-6/10 justify-center items-center lg:items-start z-10 ">
				<Form
					method="POST"
					className="flex flex-col gap-5 items-center lg:items-start"
				>
					<AuthTitle
						top={t("auth.joinTheTeam")}
						mid={t("auth.registerTitle")}
						bot={t("auth.alreadyMember")}
						nameLink={t("auth.logIn")}
						link="/login"
					/>
					{actionData?.ok === false && (
						<div className="text-error">{actionData.error}</div>
	
					)}
					<AuthForm
						btnName={t("auth.register")}
						register
						code={code}
					/>
				</Form>
			</div>
		</div>
	);
}
