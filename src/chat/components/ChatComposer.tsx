/* eslint-disable max-lines */
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { init } from "emoji-mart";
import { type JSX, type Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { BsSend } from "react-icons/bs";
import { PiImage, PiPaperclip, PiSmiley } from "react-icons/pi";

import IconBtn from "@/components/IconBtn";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import type { Message } from "../api/chat.api";
import { useChatContext } from "./ChatProvider";

await init({ data });

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
	enterEditMode: (msg: Message) => void;
	enterReplyMode: (msg: Message) => void;
}

function ChatComposer({
	ref,
	placeholder,
	onSend,
}: {
	ref?: Ref<ChatComposerHandles>;
	placeholder: string;
	onSend: (text: string) => void;
}): JSX.Element {
	const [isEmpty, setIsEmpty] = useState(true);
	const [showPicker, setShowPicker] = useState(false);

	const editableRef = useRef<HTMLDivElement>(null);
	const pickerRef = useRef<HTMLDivElement>(null);

	const { getChatMode, setChatMode, getChatText, setChatText, getChatLastText, setChatLastText } = useChatContext();

	const updateEmpty = (): void => {
		if (editableRef.current) {
			setIsEmpty(editableRef.current.textContent.trim().length === 0);
		}
	};

	const insertText = (text: string): void => {
		const editable = editableRef.current;
		if (!editable) { return }

		const selection = window.getSelection();
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

	const setText = (text: string): void => {
		const editable = editableRef.current;
		if (!editable) { return }

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
	}

	const clearText = (): void => {
		const editable = editableRef.current;
		if (!editable) { return }

		editable.textContent = "";
		setChatText("");
		setIsEmpty(true);
	}


	const handleSubmit = (self: HTMLDivElement): void => {
		const text = self.innerText.trim();

		if (text === "") {
			return;
		}

		clearText();
		onSend(text);
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
				setShowPicker(false);
			}
		}

		const composerText = getChatText();
		setText(composerText);

		if (!isTouch) {
			editableRef.current?.focus();

			document.addEventListener("keydown", handleEscape);
		}
		return (): void => {
			document.removeEventListener("keydown", handleEscape);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isTouch, placeholder]);



	const [chatMode, modeTarget] = getChatMode();

	const closeEditMode = (): void => {
		setChatMode("default", null);
		setText(getChatLastText());
	};

	const closeReplyMode = (): void => {
		setChatMode("default", null);
	};

	useImperativeHandle(ref, () => ({
		enterEditMode: (msg: Message): void => {
			if (!editableRef.current) { return; }

			setChatMode("edit", msg);
			setChatLastText(editableRef.current.textContent);
			setText(msg.content);

			editableRef.current.focus();
		},
		enterReplyMode: (msg: Message): void => {
			setChatMode("reply", msg);
			if (!editableRef.current) {
				return;
			}
			editableRef.current.focus();
		},
	}));

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
			{chatMode === "edit" && (
				<div className="flex rounded-t-xl bg-back px-4 items-center justify-between">
					<span className="text-sm text-muted">
						Editing a message - *Escap* to cancel
					</span>
					<button
						type="button"
						className="text-muted hover:text-text text-2xl cursor-pointer"
						onClick={() => {
							closeEditMode();
						}}
					>
						×
					</button>
				</div>
			)}
			{chatMode === "reply" && (
				<div className="flex rounded-t-xl bg-back px-4 items-center justify-between">
					<span className="text-sm text-muted">
						Replying to @{modeTarget?.sender.userName ?? "Unknown"} - *Escap* to cancel
					</span>
					<button
						type="button"
						className="text-muted hover:text-text text-2xl cursor-pointer"
						onClick={() => {
							closeReplyMode();
						}}
					>
						×
					</button>
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
						updateEmpty();
						setChatText(ev.currentTarget.textContent)
					}}
					onKeyDown={handleKeyDown}
				// OnPaste={handlePaste}
				/>
			</div>
			<div className="flex items-center gap-1 px-2 pt-1.5 pb-2">
				<IconBtn discrete icon={PiPaperclip} size={18} />
				<IconBtn discrete icon={PiImage} size={18} />
				<IconBtn
					discrete
					icon={PiSmiley}
					size={18}
					onClick={() => {
						setShowPicker((enable) => !enable);
					}}
				/>
				<span className="flex-1" />
				<IconBtn
					active
					icon={BsSend}
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
