import type { TFunction } from "i18next";
import { type JSX, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiArrowsClockwise, PiCloudArrowUp } from "react-icons/pi";

import { FieldErrors } from "@/components/Input/Field";

import { FileIcon } from "./FileIcon";

// Matches the backend request body limit (Kestrel default ~28.6 MiB).
export const MAX_FILE_SIZE = 29_000_000;

// eslint-disable-next-line id-length
export function formatSize(bytes: number, t: TFunction): string {
	return bytes < 1_000_000
		? t("files.sizeKb", { size: Math.max(1, Math.round(bytes / 1000)) })
		: t("files.sizeMb", { size: (bytes / 1_000_000).toFixed(1) });
}

export default function Dropzone({
	file,
	errors,
	nudge = false,
	accept,
	autoFocus = false,
	onPick,
	onReject,
}: {
	file: File | null;
	errors?: string[];
	nudge?: boolean;
	accept?: string;
	autoFocus?: boolean;
	onPick: (file: File) => void;
	onReject: (reason: string) => void;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const inputRef = useRef<HTMLInputElement>(null);
	const [dragging, setDragging] = useState(false);

	function pick(picked: File): void {
		if (picked.size > MAX_FILE_SIZE) {
			onReject(
				t("files.tooLarge", { size: formatSize(MAX_FILE_SIZE, t) }),
			);
		} else {
			onPick(picked);
		}
	}

	return (
		<div className="flex flex-col gap-1">
			<button
				type="button"
				autoFocus={autoFocus}
				className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left duration-150 cursor-pointer focus-visible:outline-0 focus-visible:border-accent
					${file === null ? "min-h-32 flex-col justify-center border-dashed text-center" : "bg-surface2"}
					${errors ? "border-error" : dragging ? "border-accent bg-accent-soft" : "border-border2 hover:border-accent"}
					${nudge ? "animate-nudge" : ""}`}
				onClick={() => inputRef.current?.click()}
				onDragOver={(ev) => {
					ev.preventDefault();
					ev.dataTransfer.dropEffect = "copy";
				}}
				onDragEnter={() => {
					setDragging(true);
				}}
				onDragLeave={(ev) => {
					if (!ev.currentTarget.contains(ev.relatedTarget as Node)) {
						setDragging(false);
					}
				}}
				onDrop={(ev) => {
					ev.preventDefault();
					setDragging(false);
					const dropped = ev.dataTransfer.files.item(0);
					if (dropped) {
						pick(dropped);
					}
				}}
			>
				{file === null ? (
					<>
						<span
							className={`flex items-center justify-center size-11 rounded-full bg-accent-soft text-accent duration-200 ${dragging ? "scale-110" : ""}`}
						>
							<PiCloudArrowUp size={22} />
						</span>
						<span className="flex flex-col gap-0.5">
							<span className="font-head font-semibold text-[15px] text-text">
								{dragging
									? t("files.upload.dropActive")
									: t("files.upload.dropHint")}
							</span>
							<span className="text-xs text-muted">
								{t("files.upload.maxSize", {
									size: formatSize(MAX_FILE_SIZE, t),
								})}
							</span>
						</span>
					</>
				) : (
					<>
						<FileIcon contentType={file.type} />
						<span
							key={file.name}
							className="flex flex-1 w-1 flex-col animate-pop"
						>
							<span className="truncate text-sm font-semibold text-text">
								{file.name}
							</span>
							<span className="text-xs tabular-nums text-muted">
								{formatSize(file.size, t)}
							</span>
						</span>
						<span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-text2">
							<PiArrowsClockwise />
							{t("files.upload.change")}
						</span>
					</>
				)}
			</button>
			<input
				ref={inputRef}
				type="file"
				accept={accept}
				hidden
				onChange={(ev) => {
					const picked = ev.target.files?.item(0);
					if (picked) {
						pick(picked);
					}
					ev.target.value = "";
				}}
			/>
			<FieldErrors errors={errors} />
		</div>
	);
}
