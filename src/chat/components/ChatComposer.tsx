/* eslint-disable max-lines */
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { init } from "emoji-mart";
import {
	type JSX,
	type Ref,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import { BsSend } from "react-icons/bs";
import { PiImage, PiSmiley, PiX } from "react-icons/pi";

import IconBtn from "@/components/Button/IconBtn";
import Tooltip from "@/components/Tooltip";
import { formatSize, MAX_FILE_SIZE } from "@/files/components/UploadDropzone";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useHover } from "@/hooks/useHover";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { resolveUser, useUser } from "@/users/hooks/users";
import { toastError } from "@/utils/error.util";

import type { Message } from "../api/chat.api";
import { IMAGE_LINE_LENGTH, parseMessageContent } from "../utils/message.util";
import { type ChatMode, useChatContext } from "./ChatProvider";

await init({ data });

const MAX_CHARS = 8192;
const MAX_IMAGES = 10;

export interface ChatDraft {
	text: string;
	images: File[];
}

interface ComposerImage {
	file: File;
	url: string;
}

interface EmojiMartEmoji {
	id: string;
	name: string;
	// Undefined for custom emoji
	native?: string;
	// E.g. "1f44d"
	unified?: string;
	keywords: string[];
	// ":+1:"
	shortcodes: string;
	emoticons?: string[];
	aliases?: string[];
	// 1–6, only when a skin tone is picked
	skin?: number;
	// Custom emoji image URL
	src?: string;
}
export interface ChatComposerHandles {
	enterEditMode: (msg: Message, el: HTMLDivElement) => void;
	enterReplyMode: (msg: Message, el: HTMLDivElement) => void;
}

function ChatComposer({
	ref,
	placeholder,
	onSend,
}: {
	ref?: Ref<ChatComposerHandles>;
	placeholder: string;
	onSend: (draft: ChatDraft, mode: ChatMode, target: Message | null) => void;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const user = useUser();
	const [isEmpty, setIsEmpty] = useState(true);
	const [charCount, setCharCount] = useState(0);
	const [showPicker, setShowPicker] = useState(false);
	const [images, setImages] = useState<ComposerImage[]>([]);

	const editableRef = useRef<HTMLDivElement>(null);
	const pickerRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const {
		id,
		getChatMode,
		setChatMode,
		getChatText,
		setChatText,
		getChatLastText,
		setChatLastText,
	} = useChatContext();

	const updateEmpty = (): void => {
		if (editableRef.current) {
			setIsEmpty(editableRef.current.textContent.trim().length === 0);
			setCharCount(editableRef.current.textContent.length);
		}
	};

	const addImages = (files: Iterable<File>): void => {
		const picked = Array.from(files);
		const accepted = picked
			.filter(
				(file) =>
					file.type.startsWith("image/") &&
					file.size <= MAX_FILE_SIZE,
			)
			.slice(0, Math.max(0, MAX_IMAGES - images.length));

		if (picked.some((file) => !file.type.startsWith("image/"))) {
			toastError(new Error(t("chat.onlyImages")));
		} else if (picked.some((file) => file.size > MAX_FILE_SIZE)) {
			toastError(
				new Error(
					t("files.tooLarge", { size: formatSize(MAX_FILE_SIZE, t) }),
				),
			);
		} else if (accepted.length < picked.length) {
			toastError(new Error(t("chat.tooManyImages", { max: MAX_IMAGES })));
		}
		if (accepted.length === 0) {
			return;
		}
		setImages((prev) => [
			...prev,
			...accepted.map((file) => ({
				file,
				url: URL.createObjectURL(file),
			})),
		]);
	};

	const removeImage = (image: ComposerImage): void => {
		URL.revokeObjectURL(image.url);
		setImages((prev) => prev.filter((other) => other !== image));
	};

	const clearImages = (): void => {
		for (const image of images) {
			URL.revokeObjectURL(image.url);
		}
		setImages([]);
	};

	const insertText = (rawText: string): void => {
		const editable = editableRef.current;
		if (!editable) {
			return;
		}

		const selection = window.getSelection();
		const selectedLength = selection?.toString().length ?? 0;
		const available =
			MAX_CHARS - (editable.textContent.length - selectedLength);
		const text = rawText.slice(0, Math.max(0, available));
		if (text === "") {
			return;
		}

		if (selection) {
			if (selection.rangeCount === 0) {
				return;
			}

			const range = selection.getRangeAt(0);

			range.deleteContents();

			const node = document.createTextNode(text);
			range.insertNode(node);

			range.setStartAfter(node);
			range.collapse(true);
			range.setEndAfter(node);

			selection.removeAllRanges();
			selection.addRange(range);
		} else {
			// Fallback for older browsers or non-editable contexts
			// eslint-disable-next-line @typescript-eslint/no-deprecated
			document.execCommand("insertText", false, text);
		}
		updateEmpty();
		setChatText(editable.textContent);
	};

	const setText = useCallback(
		(text: string): void => {
			const editable = editableRef.current;
			if (!editable) {
				return;
			}

			editable.textContent = text;
			setChatText(text);

			const selection = window.getSelection();
			if (selection) {
				const range = document.createRange();

				range.selectNodeContents(editable);
				range.collapse(false);

				selection.removeAllRanges();
				selection.addRange(range);
			}

			updateEmpty();
		},
		[setChatText],
	);

	const clearText = (): void => {
		const editable = editableRef.current;
		if (!editable) {
			return;
		}

		editable.textContent = "";
		setChatText("");
		setIsEmpty(true);
		setCharCount(0);
	};

	const [chatMode, modeTarget, modeTargetEl] = getChatMode();

	// eslint-disable-next-line react-hooks/preserve-manual-memoization
	const closeChatMode = useCallback((): void => {
		if (chatMode === "default") {
			return;
		}
		if (chatMode === "edit") {
			setText(getChatLastText());
		}
		setChatMode("default", null);
		// eslint-disable-next-line react-hooks/preserve-manual-memoization
	}, [chatMode, getChatLastText, setChatMode, setText]);

	useImperativeHandle(ref, () => ({
		enterEditMode: (msg: Message, el: HTMLDivElement): void => {
			if (!editableRef.current) {
				return;
			}

			setChatMode("edit", msg, el);
			setChatLastText(editableRef.current.textContent);
			setText(parseMessageContent(msg.content).text);
			editableRef.current.focus();
		},
		enterReplyMode: (msg: Message, el: HTMLDivElement): void => {
			setChatMode("reply", msg, el);
			if (!editableRef.current) {
				return;
			}
			editableRef.current.focus();
		},
	}));

	const handleSubmit = (self: HTMLDivElement): void => {
		const text = self.innerText.trim();
		const files = chatMode === "edit" ? [] : images.map(({ file }) => file);

		if (text === "" && files.length === 0) {
			return;
		}
		if (text.length + files.length * IMAGE_LINE_LENGTH > MAX_CHARS) {
			toastError(
				new Error(
					t("chat.tooLong", {
						count: text.length,
						max: MAX_CHARS - files.length * IMAGE_LINE_LENGTH,
					}),
				),
			);
			return;
		}

		clearText();
		if (files.length > 0) {
			clearImages();
		}
		closeChatMode();
		onSend({ text, images: files }, chatMode, modeTarget);
	};

	const handleKeyDown = (ev: React.KeyboardEvent): void => {
		const self = ev.currentTarget as HTMLDivElement;

		if (ev.key === "Enter" && !ev.shiftKey) {
			ev.preventDefault();
			handleSubmit(self);
		}
	};

	const handleEmojiSelect = (emoji: EmojiMartEmoji): void => {
		if (!editableRef.current) {
			return;
		}

		editableRef.current.focus();

		// NOTE: Do not handle custom emojis
		if (typeof emoji.native === "undefined") {
			return;
		}
		const emojiText = emoji.native;

		insertText(emojiText);
	};

	const isTouch = useMediaQuery("(pointer: coarse)");
	const [pickerIsHover, pickerHoverProps] = useHover();
	useClickOutside(pickerRef, (): void => {
		if (pickerIsHover && !isTouch) {
			return;
		}
		setShowPicker(false);
	});

	useEffect(() => {
		function handleEscape(ev: KeyboardEvent): void {
			if (ev.key === "Escape") {
				if (showPicker) {
					setShowPicker(false);
					return;
				}
				closeChatMode();
			}
		}

		document.addEventListener("keydown", handleEscape);
		return (): void => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [id, chatMode, showPicker, closeChatMode]);

	const composerText = getChatText();
	useEffect(() => {
		if (!isTouch) {
			editableRef.current?.focus();
		}

		setText(composerText);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, isTouch]);

	useEffect(
		() => (): void => {
			setImages((prev) => {
				for (const image of prev) {
					URL.revokeObjectURL(image.url);
				}
				return [];
			});
		},
		[id],
	);

	const canAttach = chatMode !== "edit";
	const hasImages = canAttach && images.length > 0;
	return (
		<div
			className="relative mx-5.5 mt-3 mb-4.5 flex flex-col rounded-xl border border-border bg-surface shadow-sm transition-colors duration-140 hover:cursor-text focus-within:border-accent"
			onClick={() => editableRef.current?.focus()}
			onDragOver={(ev) => {
				if (canAttach && ev.dataTransfer.types.includes("Files")) {
					ev.preventDefault();
					ev.dataTransfer.dropEffect = "copy";
				}
			}}
			onDrop={(ev) => {
				if (canAttach && ev.dataTransfer.files.length > 0) {
					ev.preventDefault();
					addImages(ev.dataTransfer.files);
				}
			}}
		>
			{showPicker && (
				<div className="absolute bottom-full left-0" ref={pickerRef}>
					<Picker data={data} onEmojiSelect={handleEmojiSelect} />
				</div>
			)}

			{chatMode !== "default" && (
				<div className="flex rounded-t-xl bg-back px-4 items-center justify-between">
					<a
						className="min-w-0 truncate text-sm text-muted hover:text-text cursor-pointer"
						onClick={() => {
							modeTargetEl?.scrollIntoView({
								behavior: "smooth",
								block: "center",
							});
						}}
					>
						{chatMode === "edit" ? (
							<>{t("chat.editingMessage")}</>
						) : (
							<>
								{t("chat.replyingTo", {
									name:
										(modeTarget &&
											resolveUser(modeTarget.sender, user)
												.userName) ??
										t("common.unknown"),
								})}
							</>
						)}
					</a>
					<Tooltip
						content={t("chat.cancelMode")}
						focusable={false}
						className="ml-3 inline-flex shrink-0"
					>
						<button
							type="button"
							aria-label={t("chat.cancelMode")}
							className="text-muted hover:text-text text-2xl cursor-pointer"
							onClick={() => {
								closeChatMode();
							}}
						>
							×
						</button>
					</Tooltip>
				</div>
			)}
			{hasImages && (
				<div className="flex gap-2 overflow-x-auto px-4 pt-3">
					{images.map((image) => (
						<div key={image.url} className="relative shrink-0">
							<img
								src={image.url}
								alt={image.file.name}
								title={image.file.name}
								className="h-20 w-20 rounded-lg border border-border object-cover"
							/>
							<button
								type="button"
								aria-label={t("chat.removeImage")}
								title={t("chat.removeImage")}
								className="absolute -top-1.5 -right-1.5 grid h-5 w-5 cursor-pointer place-items-center rounded-full border border-border bg-surface2 text-text2 hover:text-text"
								onClick={(ev) => {
									ev.stopPropagation();
									removeImage(image);
								}}
							>
								<PiX size={12} />
							</button>
						</div>
					))}
				</div>
			)}
			<div className="relative max-h-50 min-h-6 px-4 pt-3.25 pb-1 text-[14.5px] overflow-y-auto">
				{isEmpty && (
					<span className="pointer-events-none absolute inset-x-4 truncate text-muted">
						{placeholder}
					</span>
				)}
				<div
					ref={editableRef}
					className="text-text outline-none"
					contentEditable="plaintext-only"
					suppressContentEditableWarning
					onInput={(ev) => {
						const text = ev.currentTarget.textContent;
						if (text.length > MAX_CHARS) {
							setText(text.slice(0, MAX_CHARS));
							return;
						}
						updateEmpty();
						setChatText(text);
					}}
					onPaste={(ev) => {
						ev.preventDefault();
						const pasted = ev.clipboardData.getData("text/plain");
						if (
							pasted === "" &&
							canAttach &&
							ev.clipboardData.files.length > 0
						) {
							addImages(ev.clipboardData.files);
							return;
						}
						insertText(pasted);
					}}
					onKeyDown={handleKeyDown}
				/>
			</div>
			<div className="flex items-center gap-1 px-2 pt-1.5 pb-2">
				<IconBtn
					discrete
					icon={PiSmiley}
					tooltip={t("chat.emoji")}
					size={18}
					active={showPicker}
					onClick={() => {
						setShowPicker((enable) => !enable);
					}}
					{...pickerHoverProps}
				/>
				{canAttach && (
					<>
						<IconBtn
							discrete
							icon={PiImage}
							tooltip={t("chat.attachImage")}
							size={18}
							onClick={() => fileInputRef.current?.click()}
						/>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							multiple
							hidden
							onChange={(ev) => {
								if (ev.currentTarget.files) {
									addImages(ev.currentTarget.files);
								}
								ev.currentTarget.value = "";
							}}
						/>
					</>
				)}
				<span className="flex-1" />
				{charCount >= MAX_CHARS * 0.8 && (
					<span
						className={`mr-1 text-xs tabular-nums ${charCount >= MAX_CHARS
								? "text-red-500"
								: "text-muted"
							}`}
					>
						{charCount}/{MAX_CHARS}
					</span>
				)}
				<IconBtn
					active
					icon={BsSend}
					tooltip={t("chat.send")}
					size={16}
					disabled={isEmpty && !hasImages}
					onClick={() => {
						if (editableRef.current) {
							handleSubmit(editableRef.current);
						}
					}}
					className="grid h-9 w-9 place-items-center rounded-[11px]"
				/>
			</div>
		</div>
	);
}
export default ChatComposer;
