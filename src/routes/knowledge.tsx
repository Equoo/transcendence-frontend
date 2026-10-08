import { type JSX, useState } from "react";
import { PiSparkle } from "react-icons/pi";

import ChatbotPanel from "@/ai/components/ChatbotPanel";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import Promisable from "../components/Promisable";
import { type AppFile, fetchFiles } from "../files/api/files.api";
import FileList from "../files/components/FileList";
import type { Route } from "./+types/knowledge";

let cachedFiles: AppFile[] = [];

export function clientLoader(): {
	files: Promise<AppFile[]>;
	previousFiles: AppFile[];
} {
	const previousFiles = cachedFiles;

	const files = fetchFiles().then((result) => (cachedFiles = result));

	return { files, previousFiles };
}

let cachedOpen = true;

export default function Knowledge({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	const isLarge = useMediaQuery("(min-width: 64rem)");
	const [showRag, setShowRag] = useState<boolean | null>(cachedOpen);
	const [fullResize, setFullResize] = useState<boolean>(false);
	const open = showRag ?? isLarge;

	const fullStyle = fullResize
		? "h-full"
		: "lg:h-[min(440px,45%)] sm:h-[min(640px,calc(100dvh-2rem))] sm:inset-auto sm:right-4 sm:bottom-4 sm:w-100 sm:rounded-2xl sm:border sm:border-border sm:shadow-main";

	return (
		<div className="flex flex-col w-full h-full">
			<main className="flex flex-1 min-w-0 justify-center overflow-y-auto">
				<div className="w-7/10 flex flex-col gap-1">
					<Promisable
						data={loaderData.files}
						cached_data={loaderData.previousFiles}
					>
						{(files) => <FileList files={files}></FileList>}
					</Promisable>
				</div>
			</main>

			{open ? (
				<ChatbotPanel
					isFull={fullResize}
					onResize={(isFull: boolean) => {
						setFullResize(isFull);
					}}
					onClose={() => {
						setShowRag(false);
						cachedOpen = false;
					}}
					className={`${fullStyle} absolute inset-0 z-50  lg:static lg:z-auto  lg:w-full lg:flex-none lg:rounded-none lg:border-0 lg:border-t lg:border-border lg:shadow-none`}
				/>
			) : (
				<button
					type="button"
					aria-label="Open assistant"
					className="fixed right-4 bottom-4 z-30 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-4 py-3 font-semibold text-accent-text shadow-main transition-transform duration-75 hover:brightness-110 active:translate-y-px"
					onClick={() => {
						setShowRag(true);
						cachedOpen = true;
					}}
				>
					<PiSparkle size={18} />
					Assistant
				</button>
			)}
		</div>
	);
}
