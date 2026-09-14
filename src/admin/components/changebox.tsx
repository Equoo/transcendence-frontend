import type { JSX } from "react";
import { PiXBold } from "react-icons/pi";
import { useFetcher } from "react-router";

export default function ChangeBox({
	id,
	switchShowChange,
}: {
	id: string;
	switchShowChange: (id: string | null) => void;
}): JSX.Element {
	const fetcher = useFetcher();

	return (
		<div>
			<div className="absolute w-full h-full bg-black opacity-55"></div>
			<div className="absolute flex flex-col gap-2 justify-center items-center border-3 border-border bg-back top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 h-1/8 rounded-md">
				<div className=" flex w-full justify-end mr-5">
					<PiXBold
						className="hover:text-accent cursor-pointer"
						onClick={() => {
							switchShowChange(null);
						}}
					/>
				</div>
				<h1 className="text-xl">Change Password</h1>
				<fetcher.Form
					method="PUT"
					className="flex flex-col gap-5 items-center"
				>
					<input type="hidden" name="id" value={id}></input>
					<input
						name="password"
						placeholder="Input"
						className="bg-accent-text border-2 border-border"
					></input>
					<button
						type="submit"
						className="w-1/3 h-10 bg-accent text-accent-text font-semibold rounded-4xl cursor-pointer hover:brightness-120"
					>
						Change
					</button>
				</fetcher.Form>
			</div>
		</div>
	);
}
