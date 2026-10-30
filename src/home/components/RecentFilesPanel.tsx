import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { PiBooks } from "react-icons/pi";
import { Link } from "react-router";

import Promisable from "@/components/Promisable";
import {
	type AppFile,
	getRecentFiles,
	splitFileName,
} from "@/files/api/files.api";
import { FileIcon } from "@/files/components/FileIcon";
import { ListRowsSkeleton } from "@/friends/components/Skeletons";
import { dateLocale } from "@/translation/i18n";

import DashboardPanel from "./DashboardPanel";

function FileRows({
	files,
	limit,
}: {
	files: AppFile[];
	limit: number;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const recent = getRecentFiles(files, limit);

	if (recent.length === 0) {
		return <p className="text-sm text-text2 px-1">{t("home.noFiles")}</p>;
	}
	return (
		<ul className="flex flex-col">
			{recent.map((file) => {
				const { folder, baseName } = splitFileName(file.name);
				return (
					<li key={file.key}>
						<Link
							to={`/knowledge/${file.key}`}
							className="flex items-center gap-3 px-2 py-1.5 rounded-base text-[14.5px] text-text hover:bg-hover duration-120"
						>
							<FileIcon contentType={file.contentType} />
							<span className="flex flex-col min-w-0 flex-1">
								<span className="font-semibold truncate">
									{baseName}
								</span>
								{folder.length > 1 && (
									<span className="text-muted text-[12.5px] truncate">
										{folder}
									</span>
								)}
							</span>
							<time
								dateTime={file.lastUpdated}
								className="text-muted text-[12.5px] shrink-0"
							>
								{new Date(file.lastUpdated).toLocaleDateString(
									dateLocale(),
									{ day: "2-digit", month: "short" },
								)}
							</time>
						</Link>
					</li>
				);
			})}
		</ul>
	);
}

export default function RecentFilesPanel({
	files,
	previousFiles,
	limit = 5,
}: {
	files: Promise<AppFile[]>;
	previousFiles?: AppFile[];
	limit?: number;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	return (
		<DashboardPanel
			icon={PiBooks}
			title={t("home.recentFiles")}
			to="/knowledge"
			linkLabel={t("home.seeAll")}
		>
			<Promisable
				data={files}
				cached_data={previousFiles}
				skeleton={<ListRowsSkeleton count={limit} />}
			>
				{(data) => <FileRows files={data} limit={limit} />}
			</Promisable>
		</DashboardPanel>
	);
}
