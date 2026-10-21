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
import { PiSmiley } from "react-icons/pi";

import IconBtn from "@/components/Button/IconBtn";
import Tooltip from "@/components/Tooltip";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { resolveUser, useUser } from "@/users/hooks/users";

import type { Message } from "../api/chat.api";
import { type ChatMode, useChatContext } from "./ChatProvider";

await init({ data });

const MAX_CHARS = 8192;

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
	onSend: (text: string, mode: ChatMode, target: Message | null) => void;
}): JSX.Element {

	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const user = useUser();
	const [isEmpty, setIsEmpty] = useState(true);
	const [charCount, setCharCount] = useState(0);
	const [showPicker, setShowPicker] = useState(false);

	const editableRef = useRef<HTMLDivElement>(null);
	const pickerRef = useRef<HTMLDivElement>(null);

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
			setText(msg.content);
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

		if (text === "") {
			return;
		}

		clearText();
		closeChatMode();
		onSend(text, chatMode, modeTarget);
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

	useClickOutside(pickerRef, (): void => {
		setShowPicker(false);
	});

	const isTouch = useMediaQuery("(pointer: coarse)");
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
	return (
		<div
			className="relative mx-5.5 mt-3 mb-4.5 flex flex-col rounded-xl border border-border bg-surface shadow-sm transition-colors duration-140 hover:cursor-text focus-within:border-accent"
			onClick={() => editableRef.current?.focus()}
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
			<div className="relative max-h-50 min-h-6 px-4 pt-3.25 pb-1 text-[14.5px] overflow-y-auto">
				{isEmpty && (
					<span className="pointer-events-none absolute text-muted">
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
						insertText(ev.clipboardData.getData("text/plain"));
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
					onClick={() => {
						setShowPicker((enable) => !enable);
					}}
				/>
				<span className="flex-1" />
				{charCount >= MAX_CHARS * 0.8 && (
					<span
						className={`mr-1 text-xs tabular-nums ${
							charCount >= MAX_CHARS ? "text-red-500" : "text-muted"
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
					disabled={isEmpty}
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
