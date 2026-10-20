import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { formatSize } from "./UploadDropzone";

export default function UploadProgress({
	progress,
	total,
}: {
	progress: number;
	total: number;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const ratio = total > 0 ? progress / total : 0;
	const finishing = total > 0 && progress >= total;

	return (
		<div
			role="progressbar"
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={Math.round(ratio * 100)}
			aria-label={t("files.upload.uploading")}
			className="flex flex-col gap-1.5 animate-pop"
		>
			<div className="h-1.5 w-full overflow-hidden rounded-full bg-border2">
				<div
					className={`h-full rounded-full bg-accent duration-300 ease-out ${finishing ? "animate-pulse" : ""}`}
					style={{ width: `${ratio * 100}%` }}
				/>
			</div>
			<div className="flex justify-between text-xs font-semibold tabular-nums text-muted">
				<span>
					{finishing
						? t("files.upload.finishing")
						: t("files.upload.uploading")}
				</span>
				<span>
					{total > 0
						? `${formatSize(progress, t)} / ${formatSize(total, t)}`
						: "…"}
				</span>
			</div>
		</div>
	);
}
