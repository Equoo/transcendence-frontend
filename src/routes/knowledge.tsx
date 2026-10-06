import { type JSX, useState } from "react";
import { PiSparkle } from "react-icons/pi";

import ChatbotPanel from "@/ai/components/ChatbotPanel";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import Promisable from "../components/Promisable";
import { type AppFile, fetchFiles } from "../files/api/files.api";
import FileList from "../files/components/FileList";
import type { Route } from "./+types/knowledge";

export function clientLoader(): { files: Promise<AppFile[]> } {
	return { files: fetchFiles() };
}

export default function Knowledge({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	const isLarge = useMediaQuery("(min-width: 64rem)");
	const [showRag, setShowRag] = useState<boolean | null>(null);
	const open = showRag ?? isLarge;

	return (
		<div className="flex flex-col w-full h-full">
			<main className="flex flex-1 min-w-0 justify-center overflow-y-auto">
				<div className="w-7/10 flex flex-col gap-1">
					<Promisable data={loaderData.files}>
						{(files) => <FileList files={files}></FileList>}
					</Promisable>
				</div>
			</main>

			{open ? (
				<ChatbotPanel
					onClose={() => {
						setShowRag(false);
					}}
					className="fixed inset-0 z-50 sm:inset-auto sm:right-4 sm:bottom-4 sm:h-[min(640px,calc(100dvh-2rem))] sm:w-100 sm:rounded-2xl sm:border sm:border-border sm:shadow-main lg:static lg:z-auto lg:h-[min(440px,45%)] lg:w-full lg:flex-none lg:rounded-none lg:border-0 lg:border-t lg:shadow-none"
				/>
			) : (
				<button
					type="button"
					aria-label="Open assistant"
					className="fixed right-4 bottom-4 z-30 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-4 py-3 font-semibold text-accent-text shadow-main transition-transform duration-75 hover:brightness-110 active:translate-y-px"
					onClick={() => {
						setShowRag(true);
					}}
				>
					<PiSparkle size={18} />
					Assistant
				</button>
			)}
		</div>
	);
}
