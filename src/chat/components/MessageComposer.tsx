import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { init } from "emoji-mart";
import { type JSX, useEffect, useRef, useState } from "react";
import { BsSend } from "react-icons/bs";
import { PiImage, PiPaperclip, PiSmiley } from "react-icons/pi";

import IconBtn from "@/components/IconBtn";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useUser } from "@/users/hooks/users.hooks";

import { type Message, sendMessage } from "../api/chat.api";
import { useChat } from "../hooks/chat.hook";

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

function MessageComposer({
	placeholder,
	channelId,
}: {
	placeholder: string;
	channelId: string;
}): JSX.Element {
	const [isEmpty, setIsEmpty] = useState(true);
	const [counter, setCounter] = useState(0);
	const [showPicker, setShowPicker] = useState(false);

	const editableRef = useRef<HTMLDivElement>(null);
	const pickerRef = useRef<HTMLDivElement>(null);

	const addMsg = useChat((state) => state.addMsg);
	const updateMsg = useChat((state) => state.updateMsg);
	const user = useUser();

	const updateEmpty = (target: HTMLDivElement): void => {
		setIsEmpty(target.textContent.trim().length === 0);
	};

	const handleSend = (self: HTMLDivElement): void => {
		const text = self.innerText.trim();

		const formData = new FormData();
		formData.set("content", text);

		self.textContent = "";
		setIsEmpty(true);

		const pendingId = new Date().toString() + counter;
		let message = {
			id: pendingId,
			content: text,
			channel: { id: channelId },
			sentAt: new Date(),
			sender: user,
			status: "pending",
		} as Message;

		setCounter(counter + 1);
		addMsg(channelId, message);

		sendMessage(channelId, text)
			.then((msg) => {
				message = {
					...msg,
					sentAt: new Date(msg.sentAt),
					editAt: msg.editAt ? new Date(msg.editAt) : null,
					status: "sended",
				};
				updateMsg(channelId, pendingId, message);
			})
			.catch(() => {
				message.status = "error";
				updateMsg(channelId, pendingId, message);
			});
	};

	const handleKeyDown = (ev: React.KeyboardEvent): void => {
		const self = ev.currentTarget as HTMLDivElement;

		if (ev.key === "Enter" && !ev.shiftKey) {
			ev.preventDefault();
			handleSend(self);
		}
	};

	const insertText = (text: string): void => {
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
	};

	const handlePaste = (ev: React.ClipboardEvent): void => {
		if (!editableRef.current) {
			return;
		}

		ev.preventDefault();

		const text = ev.clipboardData.getData("text/plain");
		insertText(text);
		updateEmpty(editableRef.current);
	};

	useClickOutside(pickerRef, (): void => {
		setShowPicker(false);
	});

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
		updateEmpty(editableRef.current);
	};

	useEffect(() => {
		editableRef.current?.focus();

		function handleEscape(ev: KeyboardEvent): void {
			if (ev.key === "Escape") {
				setShowPicker(false);
			}
		}
		document.addEventListener("keydown", handleEscape);
		return (): void => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, []);

	return (
		<div className="relative mx-5.5 mt-3 mb-4.5 flex flex-col rounded-xl border border-border bg-surface shadow-sm transition-colors duration-140 focus-within:border-accent">
			{showPicker && (
				<div className="absolute bottom-full left-0" ref={pickerRef}>
					<Picker data={data} onEmojiSelect={handleEmojiSelect} />
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
					contentEditable
					suppressContentEditableWarning
					onInput={(ev) => {
						updateEmpty(ev.currentTarget);
					}}
					onKeyDown={handleKeyDown}
					onPaste={handlePaste}
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
							handleSend(editableRef.current);
						}
					}}
					className="grid h-9 w-9 place-items-center rounded-[11px]"
				/>
			</div>
		</div>
	);
}

export default MessageComposer;
