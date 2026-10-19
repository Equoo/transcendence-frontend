import type { JSX } from "react";
import type { IconType } from "react-icons";
import { PiFile, PiFileImage, PiFilePdf, PiFileText, PiFileVideo, PiFolder } from "react-icons/pi";

const FILE_ICONS: [(contentType: string) => boolean, IconType][] = [
	[(type): boolean => type.startsWith("image/"), PiFileImage],
	[(type): boolean => type.startsWith("video/"), PiFileVideo],
	[(type): boolean => type === "application/pdf", PiFilePdf],
	[(type): boolean => type.startsWith("text/"), PiFileText],
];

function IconBadge({ icon: Icon }: { icon: IconType }): JSX.Element {
	return (
		<span
			aria-hidden="true"
			className="flex items-center justify-center size-6 shrink-0 rounded-md bg-back2 text-muted"
		>
			<Icon size={14} />
		</span>
	);
}

export function FileIcon({ contentType }: { contentType: string }): JSX.Element {
	const [, icon] = FILE_ICONS.find(([matches]) => matches(contentType)) ?? [null, PiFile];
	return <IconBadge icon={icon} />;
}

export function FolderIcon(): JSX.Element {
	return <IconBadge icon={PiFolder} />;
}
