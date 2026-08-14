import type { JSX } from "react";

export default function ChangeBox({
	switchShowChange,
}: {
	switchShowChange: () => void;
}): JSX.Element {
	return (
		<div>
			<div className="absolute w-full h-full bg-black opacity-55"></div>
			<div className="absolute flex flex-col gap-5 justify-center items-center border-3 border-border bg-back top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 h-1/8 rounded-md">
				<h1 className="text-xl">Change the name</h1>
				<form className="flex flex-col gap-5 items-center">
					<input
						placeholder="Input"
						className="bg-accent-text border-2 border-border"
					></input>
					<button
						type="submit"
						className="w-1/3 h-10 bg-accent text-accent-text font-semibold rounded-4xl cursor-pointer hover:brightness-120"
						onClick={() => switchShowChange()}
					>
						Change
					</button>
				</form>
			</div>
		</div>
	);
}
