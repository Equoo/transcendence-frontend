import type { JSX } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import { AiFillFileUnknown } from "react-icons/ai";

import BlobURL from "../../components/BlobURL";
import CheckButton from "../../components/Button/CheckButton";
import Promisable from "../../components/Promisable";
import type { AppFile } from "../api/files.api";

function isTextLikeFile(filename: string, mimeType: string): boolean {
	const textExtensions = [
		".js",
		".ts",
		".tsx",
		".jsx",
		".json",
		".toml",
		".yml",
		".yaml",
		".md",
		".css",
		".html",
		".xml",
		".c",
		".cpp",
		".h",
		".java",
		".py",
		".sh",
		".php",
		".rs",
		".go",
	];

	return (
		mimeType.startsWith("text/") ||
		textExtensions.some((ext) => filename.endsWith(ext))
	);
}

export function BlobView({
	type,
	url,
	blob,
	className,
	name,
}: {
	type: string;
	url: string;
	blob: Blob;
	className?: string;
	name: string;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	if (type.startsWith("video")) {
		return (
			<video
				className={className}
				// eslint-disable-next-line no-undefined
				src={url.length === 0 ? undefined : url}
				controls
				autoPlay
			></video>
		);
	} else if (type.startsWith("image")) {
		return (
			<img
				alt={name}
				className={className}
				// eslint-disable-next-line no-undefined
				src={url.length === 0 ? undefined : url}
			></img>
		);
	} else if (type === "application/pdf") {
		return (
			<embed
				// eslint-disable-next-line no-undefined
				src={url.length === 0 ? undefined : url}
				className="w-full h-full"
			/>
		);
	} else if (isTextLikeFile(name, type)) {
		return (
			<Promisable data={blob.text()}>
				{(text) => (
					<pre
						className={`w-full p-2 bg-surface rounded-md overflow-scroll ${className}`}
					>
						{text}
					</pre>
				)}
			</Promisable>
		);
	}
	return (
		<h1 className="text-center mt-10 px-4 font-semibold font-main text-text text-2xl sm:text-4xl">
			{t("files.cannotPreview")}
		</h1>
	);
}

export function FilePreviewSkeleton(): JSX.Element {
	return (
		<div className="flex items-center justify-center w-full h-full">
			<AiFillFileUnknown
				size={200}
				color="var(--color-muted)"
				className="animate-pulse"
			/>
		</div>
	);
}

export default function FilePreview({
	blob,
	file,
}: {
	blob: Blob;
	file: AppFile;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	return (
		<div className="flex flex-col w-full h-full justify-center items-center gap-4">
			<BlobURL blob={blob}>
				{(url) => (
					<>
						<BlobView
							type={blob.type}
							name={file.name}
							blob={blob}
							url={url}
							className="h-9/10 max-w-full object-contain"
						/>
						<a
							download={file.name.slice(
								file.name.lastIndexOf("/") + 1,
							)}
							href={url}
						>
							<CheckButton active activeCheck={false}>
								{t("files.download")}
							</CheckButton>
						</a>
					</>
				)}
			</BlobURL>
		</div>
	);
}
