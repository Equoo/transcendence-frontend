import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiUploadSimple } from "react-icons/pi";

import Dropzone from "@/files/components/UploadDropzone";

import CheckButton from "../Button/CheckButton";
import Modal, { ModalFooter } from "../Modal/Modal";

export default function AvatarModal({
	pending,
	onUpload,
	onClose,
}: {
	pending: boolean;
	onUpload: (file: File) => void;
	onClose: () => void;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);

	return (
		<Modal
			title={t("profilePic.changeTitle")}
			subtitle={t("profilePic.changeHint")}
			highlight={file !== null}
			onClose={onClose}
		>
			<form
				className="contents"
				onSubmit={(ev) => {
					ev.preventDefault();
					if (file) {
						onUpload(file);
					}
				}}
			>
				<Dropzone
					autoFocus
					accept="image/*"
					file={file}
					{...(error !== null && { errors: [error] })}
					onPick={(picked) => {
						setFile(picked);
						setError(null);
					}}
					onReject={setError}
				/>
				<ModalFooter>
					<CheckButton
						type="submit"
						active={file !== null}
						activeCheck={false}
						pending={pending}
					>
						{file === null ? (
							<span className="text-text2">
								{t("files.upload.pickFirst")}
							</span>
						) : (
							<>
								<PiUploadSimple className="animate-pop" />
								{t("common.upload")}
							</>
						)}
					</CheckButton>
				</ModalFooter>
			</form>
		</Modal>
	);
}
