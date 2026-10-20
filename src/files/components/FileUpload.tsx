import { type JSX, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiFolderSimple, PiUploadSimple, PiX } from "react-icons/pi";

import CheckButton from "@/components/Button/CheckButton";
import { Select } from "@/components/Input/Select";
import { FieldErrors, TextSlot } from "@/events/components/composer/Slot";
import usePogressFetch from "@/hooks/useProgressFetch";

import type { ProblemDetail, ValidationErrors } from "../../api/problem_detail";
import Dropzone, { formatSize, MAX_FILE_SIZE } from "./UploadDropzone";
import UploadProgress from "./UploadProgress";

const NAME_MAX_LENGTH = 100;
const FIELD_ERROR_KEYS = new Set(["File", "Name"]);

export default function FileUpload({
	onClose,
	currentPath = "/",
	folders,
}: {
	onClose: () => void;
	currentPath?: string;
	folders: string[];
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const { progress, total, doFetch, abort } = usePogressFetch();
	const [file, setFile] = useState<File | null>(null);
	const [name, setName] = useState("");
	const [folder, setFolder] = useState(currentPath);
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [nudged, setNudged] = useState<"file" | "name" | null>(null);
	const [uploading, setUploading] = useState(false);
	const nameRef = useRef<HTMLInputElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const destinations = Array.from(new Set(["/", currentPath, ...folders]));

	const nameErrors = name.includes("/") ? [t("files.noSlash")] : errors.Name;
	const generalErrors = Object.entries(errors)
		.filter(([key]) => !FIELD_ERROR_KEYS.has(key))
		.flatMap(([, messages]) => messages);
	const missing = file === null ? "file" : name.trim() === "" ? "name" : null;
	const ready = missing === null && !name.includes("/");

	function close(): void {
		abort();
		onClose();
	}

	useEffect(
		() => (): void => {
			abort();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	function pick(picked: File): void {
		if (picked.size > MAX_FILE_SIZE) {
			setNudged("file");
			setErrors({
				File: [
					t("files.tooLarge", { size: formatSize(MAX_FILE_SIZE, t) }),
				],
			});
			return;
		}
		if (name === "" || name === file?.name) {
			setName(picked.name);
		}
		setFile(picked);
		setErrors({});
		nameRef.current?.focus();
	}

	async function send(): Promise<void> {
		if (file === null || !ready) {
			setNudged(missing ?? "name");
			if (missing === "name") {
				nameRef.current?.focus();
			}
			return;
		}
		const body = new FormData();
		body.set("Name", `${folder}${name.trim()}`);
		body.set("File", file);

		setErrors({});
		setUploading(true);
		try {
			const res = await doFetch("/api/files", {
				method: "POST",
				body,
			});
			if (res.ok) {
				onClose();
				return;
			}
			const problem = (await res.json()) as ProblemDetail;
			setErrors(
				problem.errors ?? {
					"": [problem.detail ?? problem.title],
				},
			);
		} catch (err) {
			if (!(err instanceof DOMException && err.name === "AbortError")) {
				console.error(err);
				setErrors({ "": [t("files.upload.failed")] });
			}
		}
		setUploading(false);
	}

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="file-upload-title"
			className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-back/85 p-4 backdrop-blur-md animate-[fade-in_0.2s_ease-out]"
			onKeyDown={(ev) => {
				if (
					ev.key === "Escape" &&
					ev.currentTarget.contains(ev.target as Node)
				) {
					close();
				}
			}}
			onAnimationEnd={(ev) => {
				if (ev.animationName === "nudge") {
					setNudged(null);
				}
			}}
			onDragOver={(ev) => {
				ev.preventDefault();
			}}
			onDrop={(ev) => {
				ev.preventDefault();
			}}
		>
			<form
				ref={formRef}
				className={`flex w-full max-w-md flex-col gap-4 rounded-3xl border bg-surface p-5 shadow-main duration-300 animate-in sm:p-7
					${ready ? "border-accent/40 ring-4 ring-accent/10" : "border-border"}`}
				onSubmit={(ev) => {
					ev.preventDefault();
					if (!uploading) {
						void send();
					}
				}}
			>
				<header className="flex items-start gap-4">
					<div className="flex-1 min-w-0">
						<h2
							id="file-upload-title"
							className="font-head font-semibold text-xl text-text tracking-tight"
						>
							{t("files.uploadTitle")}
						</h2>
						<p className="text-sm text-text2">
							{t("files.upload.subtitle")}
						</p>
					</div>
					<button
						type="button"
						aria-label={t("common.cancel")}
						className="flex items-center justify-center size-9 shrink-0 -mr-2 -mt-1 rounded-full text-text2 duration-150 cursor-pointer hover:bg-hover hover:text-text"
						onClick={close}
					>
						<PiX size={18} />
					</button>
				</header>

				<fieldset
					disabled={uploading}
					className="flex flex-col gap-3 duration-200 disabled:opacity-60"
				>
					<Dropzone
						file={file}
						errors={errors.File}
						nudge={nudged === "file"}
						onPick={pick}
					/>
					<TextSlot
						inputRef={nameRef}
						value={name}
						maxLength={NAME_MAX_LENGTH}
						label={t("common.name")}
						placeholder={t("files.upload.namePlaceholder")}
						inputClassName="font-head text-lg font-semibold text-text"
						errors={nameErrors}
						next={file !== null && missing === "name"}
						nudge={nudged === "name"}
						onChange={setName}
						onEnter={() => formRef.current?.requestSubmit()}
					/>
					<div className="-mx-2 flex items-center gap-2 px-2 text-sm text-text2">
						<PiFolderSimple className="shrink-0" />
						<span className="shrink-0">
							{t("files.upload.into")}
						</span>
						<Select
							ghost
							value={folder}
							className="min-w-0 flex-1"
							options={destinations.map((dest) => ({
								value: dest,
								label: dest,
							}))}
							onChange={setFolder}
						/>
					</div>
				</fieldset>

				<div className="flex flex-col gap-3 border-t border-border pt-4">
					{uploading && (
						<UploadProgress progress={progress} total={total} />
					)}
					<FieldErrors errors={generalErrors} />
					{uploading ? (
						<CheckButton
							type="button"
							key="cancel"
							discrete
							onClick={() => {
								abort();
							}}
						>
							{t("files.upload.cancel")}
						</CheckButton>
					) : (
						<CheckButton
							type="submit"
							key="upload"
							active={ready}
							activeCheck={false}
						>
							{ready ? (
								<>
									<PiUploadSimple className="animate-pop" />
									{t("common.upload")}
								</>
							) : (
								<span className="text-text2">
									{missing === "file"
										? t("files.upload.pickFirst")
										: missing === "name"
											? t("files.upload.nameFirst")
											: t("files.noSlash")}
								</span>
							)}
						</CheckButton>
					)}
				</div>
			</form>
		</div>
	);
}
