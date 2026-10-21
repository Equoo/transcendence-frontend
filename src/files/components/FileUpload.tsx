import { type JSX, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiUploadSimple } from "react-icons/pi";

import CheckButton from "@/components/Button/CheckButton";
import { Input } from "@/components/Input/Input";
import Modal, { ModalFooter } from "@/components/Modal/Modal";
import { useNudge } from "@/hooks/useNudge";
import usePogressFetch from "@/hooks/useProgressFetch";

import {
	otherErrors,
	type ProblemDetail,
	type ValidationErrors,
} from "../../api/problem_detail";
import FolderPicker from "./FolderPicker";
import Dropzone from "./UploadDropzone";
import UploadProgress from "./UploadProgress";

const NAME_MAX_LENGTH = 100;
const FIELD_KEYS = ["File", "Name"];

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
	const { nudged, nudge, onAnimationEnd } = useNudge<"file" | "name">();
	const [uploading, setUploading] = useState(false);
	const nameRef = useRef<HTMLInputElement>(null);
	const destinations = Array.from(new Set(["/", currentPath, ...folders]));

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
		if (name === "" || name === file?.name) {
			setName(picked.name);
		}
		setFile(picked);
		setErrors({});
		nameRef.current?.focus();
	}

	async function send(): Promise<void> {
		if (file === null || !ready) {
			nudge(missing ?? "name");
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
		<Modal
			title={t("files.uploadTitle")}
			subtitle={t("files.upload.subtitle")}
			highlight={ready}
			onClose={close}
			onAnimationEnd={onAnimationEnd}
		>
			<form
				className="contents"
				onSubmit={(ev) => {
					ev.preventDefault();
					if (!uploading) {
						void send();
					}
				}}
			>
				<fieldset
					disabled={uploading}
					className="flex flex-col gap-3 duration-200 disabled:opacity-60"
				>
					<Dropzone
						autoFocus
						file={file}
						errors={errors.File}
						nudge={nudged === "file"}
						onPick={pick}
						onReject={(reason) => {
							nudge("file");
							setErrors({ File: [reason] });
						}}
					/>
					<Input
						ref={nameRef}
						name="Name"
						value={name}
						maxLength={NAME_MAX_LENGTH}
						label={t("common.name")}
						placeholder={t("files.upload.namePlaceholder")}
						className={nudged === "name" ? "animate-nudge" : ""}
						errors={
							name.includes("/")
								? { ...errors, Name: [t("files.noSlash")] }
								: errors
						}
						onChange={(ev) => {
							setName(ev.target.value);
						}}
					/>
					<FolderPicker
						label={t("files.folder")}
						folders={destinations}
						value={folder}
						onChange={setFolder}
					/>
				</fieldset>

				<ModalFooter errors={otherErrors(errors, FIELD_KEYS)}>
					{uploading && (
						<UploadProgress progress={progress} total={total} />
					)}
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
				</ModalFooter>
			</form>
		</Modal>
	);
}
