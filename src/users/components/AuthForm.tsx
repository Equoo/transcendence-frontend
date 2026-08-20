import type { JSX } from "react";
import { PiLock, PiUser } from "react-icons/pi";
import { Input } from "../../components/Input";
import CheckButton from "../../components/CheckButton";
import { useNavigation } from "react-router";

interface Title {
	top: string;
	mid: string;
	bot: string;
	nameLink: string;
	link: string;
}

export function AuthTitle({
	top,
	mid,
	bot,
	nameLink,
	link,
}: Title): JSX.Element {
	return (
		<div className="flex flex-col ">
			<h3 className="text-text2 font-bold tracking-tight">{top}</h3>
			<h1 className="text-6xl font-semibold font-head text-text tracking-tight">
				{mid}
				<span className=" text-accent">.</span>
			</h1>
			<h3 className="text-text font-head">
				{bot}
				<a href={link} className="text-accent">
					{nameLink}
				</a>
			</h3>
		</div>
	);
}

type Side = "r" | "l";

export function AuthLogo({ side }: { side: Side }): JSX.Element {
	// eslint-disable-next-line @eslint-react/purity
	const randomNumber: number = Date.now();

	let animChoice: string;
	let animTime: string;
	let sideCss: string;

	if (randomNumber % 15) {
		animChoice = "animate-spin";
		animTime = "[animation-duration:200s]";
	} else {
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
				className={`scale-500 opacity-20 ${animChoice} ${animTime} `}
			/>
		</div>
	);
}

export function AuthForm({ btnName }: { btnName: string }): JSX.Element {
	const navigation = useNavigation();

	return (
		<div className="flex flex-col w-3/4 gap-4">
			<Input
				className="h-12"
				placeholder="Username"
				type="text"
				name="Username"
			>
				<PiUser className="ml-2 mr-2" />
			</Input>
			<Input
				className="h-12"
				placeholder="Password"
				type="password"
				name="Password"
			>
				<PiLock className="ml-2 mr-2" />
			</Input>
			<div className="flex justify-center w-full ">
				<CheckButton
					pending={navigation.state !== "idle"}
					active
					activeCheck={false}
					type="submit"
					className="w-3/7"
				>
					{btnName}
				</CheckButton>
			</div>
		</div>
	);
}
