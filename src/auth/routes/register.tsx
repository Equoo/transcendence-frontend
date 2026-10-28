import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { Form, Link, redirect, useLocation } from "react-router";

import { AuthForm, AuthLogo, AuthTitle } from "../../auth/components/AuthForm";
import { LegalLinks } from "../../legal/components/LegalPage";
import { registerUser } from "../api/auth";
import type { Route } from "./+types/register";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({ request }: Route.ClientActionArgs) {
	const formdata = await request.formData();
	const res = await registerUser(formdata);

	if (!res.ok) {
		return res.error;
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
		<div className="flex items-center justify-center w-full h-full bg-back gap-20 signup relative">
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
					<div className="text-error">{actionData?.detail}</div>
					<AuthForm
						btnName={t("auth.register")}
						register
						errors={actionData?.errors}
						code={code}
					/>
					<p className="text-xs text-muted w-3/4 text-center">
						{t("legal.byContinuing")}
						<Link
							to="/terms"
							className="text-accent"
							viewTransition
						>
							{t("legal.terms.title")}
						</Link>
						{t("legal.and")}
						<Link
							to="/privacy"
							className="text-accent"
							viewTransition
						>
							{t("legal.privacy.title")}
						</Link>
						.
					</p>
				</Form>
			</div>
			<LegalLinks className="absolute bottom-4 z-10" />
		</div>
	);
}
