import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { PiUser } from "react-icons/pi";
import { SlLock } from "react-icons/sl";
import { Link, useNavigation } from "react-router";

import CheckButton from "../../components/Button/CheckButton";
import { Input } from "../../components/Input/Input";

type Side = "r" | "l";

export function AuthTitle({
	top,
	mid,
	bot,
	nameLink,
	link,
}: {
	top: string;
	mid: string;
	bot: string;
	nameLink: string;
	link: string;
}): JSX.Element {
	return (
		<div className="flex flex-col items-center lg:items-start">
			<h3 className="text-text2 font-bold tracking-tight">{top}</h3>
			<h1 className="text-6xl font-semibold font-head text-text tracking-tight text-center lg:text-left">
				{mid}
				<span className=" text-accent">.</span>
			</h1>
			<h3 className="text-text font-head">
				{bot}
				<Link to={link} className="text-accent" viewTransition>
					{nameLink}
				</Link>
			</h3>
		</div>
	);
}

export function AuthLogo({ side }: { side: Side }): JSX.Element {
	// eslint-disable-next-line @eslint-react/purity, react-hooks/purity
	const randomNumber: number = Date.now();

	let animChoice: string;
	let animTime: string;
	let sideCss: string;

	if (randomNumber % 15) {
		animChoice = "animate-spin";
		animTime = "[animation-duration:200s]";
	} else {
		// eslint-disable-next-line no-console
		console.log("Bounce KG Rebondit");
		animChoice = "animate-bounce";
		animTime = "[animation-duration:2s]";
	}

	if (side === "l") {
		sideCss = "ml-200";
	} else {
		sideCss = "mr-200";
	}

	return (
		<div className={`absolute z-0  mt-40 ${sideCss}`}>
			<img
				src="/logo/icon-mono.svg"
				className={`min-w-100 scale-500 opacity-20 ${animChoice} ${animTime} `}
			/>
		</div>
	);
}

export function AuthForm({
	btnName,
	code,
	register = false,
}: {
	btnName: string;
	code?: string | null;
	register?: boolean;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const navigation = useNavigation();

	return (
		<div className="flex flex-col w-3/4 gap-4">
			<Input
				maxLength={25}
				className="h-12"
				placeholder={t("auth.username")}
				type="text"
				name="Username"
				label={t("auth.username")}
				required
			>
				<PiUser className="ml-2 mr-2 text-text2" size={20} />
			</Input>
			<Input
				password
				maxLength={256}
				className="h-12"
				placeholder={t("auth.password")}
				type="password"
				name="Password"
				label={t("auth.password")}
				required
			>
				<SlLock className="ml-2 mr-2 text-text2" size={20} />
			</Input>
			{register && (
				<Input
					maxLength={200}
					className="h-12"
					placeholder={t("auth.invitationCode")}
					value={code ?? ""}
					grayed={Boolean(code)}
					type="text"
					name="Code"
					label={t("auth.code")}
					required
				/>
			)}
			<div className="flex justify-center w-full ">
				<CheckButton
					pending={navigation.state !== "idle"}
					active
					activeCheck={false}
					type="submit"
					className="w-3/7 min-w-fit"
				>
					{btnName}
				</CheckButton>
			</div>
		</div>
	);
}
