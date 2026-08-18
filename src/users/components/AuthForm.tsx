import type { JSX } from "react";
import type { IconType } from "react-icons";
import { PiLock, PiUser } from "react-icons/pi";

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

interface Input {
	Icon: IconType;
	type: string;
	name: string;
	placeholder: string;
	msgError?: string;
}

export function AuthInput({
	Icon,
	placeholder,
	type,
	name,
	msgError,
}: Input): JSX.Element {
	if (typeof msgError !== "undefined") {
		return (
			<div className="flex flex-col text-red-500">
				<div className="flex items-center rounded-md bg-surface border border-red-400">
					<Icon className="ml-4" />
					<input
						type={type}
						name={name}
						className="w-full rounded-md h-13 border-none ring-0"
						placeholder={placeholder}
					></input>
				</div>
				<p>{msgError}</p>
			</div>
		);
	}
	return (
		<div className="flex items-center rounded-md bg-surface border-border border">
			<Icon className="ml-4" />
			<input
				type={type}
				name={name}
				className="w-full rounded-md h-13 border-none ring-0 bg-surface"
				placeholder={placeholder}
			></input>
		</div>
	);
}

export function AuthForm({ btnName }: { btnName: string }): JSX.Element {
	return (
		<div className="flex flex-col w-3/4 gap-4">
			<AuthInput
				Icon={PiUser}
				placeholder="Username"
				type="text"
				name="username"
			/>
			<AuthInput
				Icon={PiLock}
				placeholder="Password"
				type="password"
				name="password"
			/>
			<div className="flex justify-center">
				<button
					type="submit"
					className="w-1/3 h-10 bg-accent text-accent-text font-semibold rounded-4xl cursor-pointer hover:brightness-120"
				>
					{btnName}
				</button>
			</div>
		</div>
	);
}
