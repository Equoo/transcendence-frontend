import type { JSX } from "react/jsx-runtime";

import BlobURL from "../../components/BlobURL";
import CheckButton from "../../components/CheckButton";
import Promisable from "../../events/components/Promisable";
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
	if (type.startsWith("video")) {
		return (
			<video className={className} src={url} controls autoPlay></video>
		);
	} else if (type.startsWith("image")) {
		return <img className={className} src={url}></img>;
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
		<h1 className="text-center mt-10 font-semibold font-main text-text text-4xl">
			Can't preview file
		</h1>
	);
}

export default function FilePreview({
	blob,
	file,
}: {
	blob: Blob;
	file: AppFile;
}): JSX.Element {
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
							className="h-9/10"
						/>
						<a download={file.name} href={url}>
							<CheckButton active activeCheck={false}>
								Download
							</CheckButton>
						</a>
					</>
				)}
			</BlobURL>
		</div>
	);
}
