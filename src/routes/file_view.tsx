import type { JSX } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router";

import Promisable from "../components/Promisable";
import { type AppFile, downloadFile, fetchFile } from "../files/api/files.api";
import FilePreview, {
	FilePreviewSkeleton,
} from "../files/components/FilePreview";
import { HEADER_PADDING } from "../friends/components/BackToList";
import type { Route } from "./+types/file_view";

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
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const navigate = useNavigate();
	return (
		<div className="w-full h-full flex flex-col pb-4 gap-2">
			<div className={`flex flex-none items-center gap-2 py-3 ${HEADER_PADDING}`}>
				<button
					type="button"
					aria-label={t("common.goBack")}
					className="shrink-0 -ml-1.5 p-1 rounded-xl text-muted hover:bg-hover hover:text-text cursor-pointer"
					onClick={() => {
						void navigate(-1);
					}}
				>
					<FiChevronLeft size={25} />
				</button>
				<h1 className="font-semibold font-head text-xl text-text truncate">
					{loaderData.meta.name}
				</h1>
			</div>
			<div className="flex-1 min-h-0 px-4 sm:px-6">
				<Promisable
					data={loaderData.blob}
					skeleton={<FilePreviewSkeleton />}
				>
					{(blob) => (
						<FilePreview
							blob={blob}
							file={loaderData.meta}
						></FilePreview>
					)}
				</Promisable>
			</div>
		</div>
	);
}
