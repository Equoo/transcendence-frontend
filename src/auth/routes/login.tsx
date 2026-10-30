import i18n from "i18next";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { Form, redirect } from "react-router";

import type { ProblemDetail } from "../../api/problem_detail";
import { AuthForm, AuthLogo, AuthTitle } from "../../auth/components/AuthForm";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { LegalLinks } from "../../legal/components/LegalPage";
import { loginUser, type UserResult } from "../api/auth";
import type { Route } from "./+types/login";

export async function clientAction({
	request,
}: Route.ClientActionArgs): Promise<UserResult | Response> {
	const formdata = await request.formData();
	const res = await loginUser(formdata);

	if (!res.ok) {
		return res;
	}
	return redirect("/");
}

function loginError(error: ProblemDetail | undefined): string {
	if (error?.errorCode === "INVALID_AUTH") {
		return i18n.t("auth.invalidLogin");
	}
	if (error?.errorCode || error?.errors) {
		return error.detail ?? error.title;
	}
	return i18n.t("errors.somethingWrong");
}

export default function Login({
	actionData,
}: Route.ComponentProps): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();

	return (
		<div className="flex items-center justify-center w-full h-full bg-back2 gap-20 login relative">
			<AuthLogo side={"r"} />
			<LanguageSwitcher className="absolute top-4 right-4 z-20" />
			<div className="flex flex-col lg:w-2/3 h-6/10 justify-center z-10 items-center lg:items-end">
				<Form
					method="POST"
					className="flex flex-col gap-5 items-center lg:items-start"
				>
					<AuthTitle
						top={t("auth.joinTheTeam")}
						mid={t("auth.loginTitle")}
						bot={t("auth.newInTeam")}
						nameLink={t("auth.signUp")}
						link="/register"
					/>
					{actionData?.ok === false && (
						<div className="text-error">
							{loginError(actionData.error)}
						</div>
					)}
					<AuthForm btnName={t("auth.login")} />
				</Form>
			</div>
			<LegalLinks className="absolute bottom-4 z-10" />
		</div>
	);
}
