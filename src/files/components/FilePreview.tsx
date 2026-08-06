import type { JSX } from "react/jsx-runtime";
import BlobURL from "../../components/BlobURL";
import type { AppFile } from "../api/files.api";
import CheckButton from "../../components/CheckButton";

function BlobView({ type, url }: { type: string; url: string }): JSX.Element {
	if (type.startsWith("video")) {
		return <video src={url} controls autoPlay></video>;
	} else if (type.startsWith("image")) {
		return <img src={url}></img>;
	} else if (type.startsWith("text")) {
		return (
			<iframe
				className="w-full bg-surface rounded-md"
				sandbox=""
				src={url}
			/>
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
		<div className="flex flex-col w-full justify-center items-center gap-4">
			<BlobURL blob={blob}>
				{(url) => (
					<>
						<BlobView type={blob.type} url={url} />
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
