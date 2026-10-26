import { type JSX, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { PiImageBroken, PiX } from "react-icons/pi";

import type { MessageImage } from "../../utils/message.util";

function ImageLightbox({
	image,
	onClose,
}: {
	image: MessageImage;
	onClose: () => void;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();

	useEffect(() => {
		function handleEscape(ev: KeyboardEvent): void {
			if (ev.key === "Escape") {
				ev.stopPropagation();
				onClose();
			}
		}

		document.addEventListener("keydown", handleEscape, true);
		return (): void => {
			document.removeEventListener("keydown", handleEscape, true);
		};
	}, [onClose]);

	return createPortal(
		<div
			className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4"
			onClick={onClose}
		>
			<button
				type="button"
				aria-label={t("common.close")}
				className="absolute top-4 right-4 cursor-pointer text-white/80 hover:text-white"
				onClick={onClose}
			>
				<PiX size={28} />
			</button>
			<img
				src={image.src}
				alt={image.name}
				className="max-h-full max-w-full rounded-lg object-contain"
				onClick={(ev) => {
					ev.stopPropagation();
				}}
			/>
		</div>,
		document.body,
	);
}

function ImageThumb({
	image,
	onOpen,
}: {
	image: MessageImage;
	onOpen: () => void;
}): JSX.Element {
	const [broken, setBroken] = useState(false);

	if (broken) {
		return (
			<div className="flex h-24 w-32 items-center justify-center rounded-lg border border-border bg-surface2 text-muted">
				<PiImageBroken size={28} />
			</div>
		);
	}
	return (
		<img
			src={image.src}
			alt={image.name}
			title={image.name}
			loading="lazy"
			className="max-h-75 max-w-full rounded-lg border border-border object-contain sm:max-w-100 cursor-pointer"
			onError={() => {
				setBroken(true);
			}}
			onClick={onOpen}
		/>
	);
}

function MessageImages({ images }: { images: MessageImage[] }): JSX.Element {
	const [opened, setOpened] = useState<MessageImage | null>(null);

	return (
		<div className="my-1 flex flex-wrap gap-2 whitespace-normal">
			{images.map((image, idx) => (
				<ImageThumb
					// eslint-disable-next-line @eslint-react/no-array-index-key
					key={`${image.src}_${idx}`}
					image={image}
					onOpen={() => {
						setOpened(image);
					}}
				/>
			))}
			{opened && (
				<ImageLightbox
					image={opened}
					onClose={() => {
						setOpened(null);
					}}
				/>
			)}
		</div>
	);
}

export default MessageImages;
