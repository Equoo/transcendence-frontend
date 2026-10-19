import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import { PiBooks, PiFile, PiFileImage, PiFilePdf, PiFileText, PiFileVideo } from "react-icons/pi";
import { Link } from "react-router";

import Promisable from "@/components/Promisable";
import type { AppFile } from "@/files/api/files.api";
import { ListRowsSkeleton } from "@/friends/components/Skeletons";

import DashboardPanel from "./DashboardPanel";

const FILE_ICONS: [(contentType: string) => boolean, IconType][] = [
	[(type): boolean => type.startsWith("image/"), PiFileImage],
	[(type): boolean => type.startsWith("video/"), PiFileVideo],
	[(type): boolean => type === "application/pdf", PiFilePdf],
	[(type): boolean => type.startsWith("text/"), PiFileText],
];

function FileIcon({ contentType }: { contentType: string }): JSX.Element {
	const [, Icon] = FILE_ICONS.find(([matches]) => matches(contentType)) ?? [null, PiFile];
	return <Icon size={14} />;
}

function FileRows({ files, limit }: { files: AppFile[]; limit: number }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const recent = files
		.toSorted((lhs, rhs) => rhs.lastUpdated.localeCompare(lhs.lastUpdated))
		.slice(0, limit);

	if (recent.length === 0) {
		return <p className="text-sm text-text2 px-1">{t("home.noFiles")}</p>;
	}
	return (
		<ul className="flex flex-col">
			{recent.map((file) => {
				const slash = file.name.lastIndexOf("/");
				return (
					<li key={file.key}>
						<Link
							to={`/knowledge/${file.key}`}
							className="flex items-center gap-3 px-2 py-1.5 rounded-base text-[14.5px] text-text hover:bg-hover duration-120"
						>
							<span className="flex items-center justify-center size-6 shrink-0 rounded-md bg-back2 text-muted">
								<FileIcon contentType={file.contentType} />
							</span>
							<span className="flex flex-col min-w-0 flex-1">
								<span className="font-semibold truncate">{file.name.slice(slash + 1)}</span>
								{slash > 0 && <span className="text-muted text-[12.5px] truncate">{file.name.slice(0, slash)}</span>}
							</span>
							<time dateTime={file.lastUpdated} className="text-muted text-[12.5px] shrink-0">
								{new Date(file.lastUpdated).toLocaleDateString([], { day: "2-digit", month: "short" })}
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
	limit = 5,
}: {
	files: Promise<AppFile[]>;
	limit?: number;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	return (
		<DashboardPanel icon={PiBooks} title={t("home.recentFiles")} to="/knowledge" linkLabel={t("home.seeAll")}>
			<Promisable data={files} skeleton={<ListRowsSkeleton count={limit} />}>
				{(data) => <FileRows files={data} limit={limit} />}
			</Promisable>
		</DashboardPanel>
	);
}
