import type { JSX } from "react/jsx-runtime";
import type { Route } from "./+types/file_view";
import { downloadFile, fetchFile, type AppFile } from "../files/api/files.api";
import Promisable from "../events/components/Promisable";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router";
import FilePreview from "../files/components/FilePreview";

export async function clientLoader({
	params,
}: Route.ClientLoaderArgs): Promise<{
	blob: Promise<Blob>;
	meta: AppFile;
}> {
	return {
		blob: downloadFile(params.key),
		meta: await fetchFile(params.key),
	};
}

export default function FileView({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	const navigate = useNavigate();
	return (
		<div className="w-full flex flex-col px-6 py-4 gap-2">
			<div className="flex items-center gap-2">
				<FiChevronLeft
					size={25}
					color="#9c9384"
					onClick={() => {
						void navigate(-1);
					}}
					className="cursor-pointer"
				/>
				<h1 className="font-semibold font-head text-xl text-text">
					{loaderData.meta.name}
				</h1>
			</div>
			<Promisable data={loaderData.blob} skeleton={<div>coucou</div>}>
				{(blob) => (
					<FilePreview
						blob={blob}
						file={loaderData.meta}
					></FilePreview>
				)}
			</Promisable>
		</div>
	);
}
