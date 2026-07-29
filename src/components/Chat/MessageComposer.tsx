import { type JSX, type ReactNode, useState, useRef, useEffect } from "react";
import { useFetcher } from "react-router";
import { NavLink } from "react-router";
import type { Channel } from "../../models/chat"
import { PiPaperclip, PiImage, PiSmiley } from "react-icons/pi";
import { BsSend } from "react-icons/bs";
import IconBtn from "../IconBtn";
import Alert from "../Alert";
import { toast } from "react-toastify";
import { useClickOutside } from "../../hooks/useClickOutside";

import data from '@emoji-mart/data'
import { init } from 'emoji-mart'
import Picker from '@emoji-mart/react'

init({ data })

function MessageComposer({
	placeholder,
	channelId,
}: {
	placeholder: string;
	channelId: string;
}): JSX.Element {
	const fetcher = useFetcher();
	const [isEmpty, setIsEmpty] = useState(true);
	const [showPicker, setShowPicker] = useState(false);
	
	const editableRef = useRef<HTMLDivElement>(null);
	const pickerRef = useRef<HTMLDivElement>(null);

	const isSending = fetcher.state !== "idle";

	const handleInput = () => {
		const text = editableRef.current?.textContent ?? "";
		setIsEmpty(text.trim().length === 0);
	};

	const handleSend = () => {
		const text = editableRef.current?.innerText?.trim();
		if (!text) return;

		const formData = new FormData();
		formData.set("content", text);

		fetcher.submit(formData, {
			method: "post",
			action: `/channels/${channelId}/messages`,
		});

		if (editableRef.current) {
			editableRef.current.textContent = "";
		}
		setIsEmpty(true);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handlePaste = (e) => {
		e.preventDefault();

		const text = e.clipboardData.getData("text/plain");

		document.execCommand("insertText", false, text);
	}

	useClickOutside(pickerRef, () => setShowPicker(false));

	const handleEmojiSelect = (emoji: any) => {
		editableRef.current?.focus();

		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return;

		const range = selection.getRangeAt(0);

		range.deleteContents();

		const node = document.createTextNode(emoji.native);
		range.insertNode(node);

		range.setStartAfter(node);
		range.collapse(true);

		selection.removeAllRanges();
		selection.addRange(range);

		handleInput();
	}

	useEffect(() => {
		function handleEscape(e: KeyboardEvent) {
			if (e.key === "Escape") setShowPicker(false);
		}
		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, []);

	return (
		<div className="relative mx-[22px] mt-3 mb-[18px] flex flex-col rounded-xl border border-border bg-surface shadow-sm transition-colors duration-[140ms] focus-within:border-accent">
			{showPicker && (
				<div className="absolute bottom-full left-0" ref={pickerRef}>
					<Picker
						data={data}
						onEmojiSelect={handleEmojiSelect}
					/>
				</div>
			)}
			<div className="relative max-h-50 min-h-6 px-4 pt-[13px] pb-1 text-[14.5px] overflow-y-auto">
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
					onInput={handleInput}
					onKeyDown={handleKeyDown}
					onPaste={handlePaste}
				/>
			</div>
			<div className="flex items-center gap-1 px-2 pt-1.5 pb-2">
				<IconBtn discrete icon={PiPaperclip} size={18} />
				<IconBtn discrete icon={PiImage} size={18} />
				<IconBtn discrete icon={PiSmiley} size={18} onClick={() => setShowPicker((v) => !v)} />
				<span className="flex-1" />
				<IconBtn
					active
					icon={BsSend}
					size={16}
					disabled={isEmpty || isSending}
					onClick={handleSend}
					className="grid h-9 w-9 place-items-center rounded-[11px]"
				/>
			</div>
		</div>
	);
}

export default MessageComposer;
