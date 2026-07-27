import { type JSX, type ReactNode, useState, useRef } from "react";
import { NavLink } from "react-router";
import type { Channel } from "../../models/chat"
import { PiPaperclip, PiImage, PiSmiley } from "react-icons/pi";
import { BsSend } from "react-icons/bs";
import IconBtn from "../IconBtn";

function MessageComposer({
	placeholder
}: {
	placeholder: string;
}): JSX.Element {
	const [isEmpty, setIsEmpty] = useState(true);
	const editableRef = useRef<HTMLDivElement>(null);

	const handleInput = () => {
		const text = editableRef.current?.textContent ?? "";
		setIsEmpty(text.trim().length === 0);
	};

	return (
		<div className="mx-[22px] mt-3 mb-[18px] flex flex-col rounded-xl border border-border bg-surface shadow-sm transition-colors duration-[140ms] focus-within:border-accent">
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
				/>
			</div>
			<div className="flex items-center gap-1 px-2 pt-1.5 pb-2">
				<IconBtn discrete icon={PiPaperclip} size={18} />
				<IconBtn discrete icon={PiImage} size={18} />
				<IconBtn discrete icon={PiSmiley} size={18} />
				<span className="flex-1" />
				<IconBtn
					active
					icon={BsSend}
					size={16}
					className="grid h-9 w-9 place-items-center rounded-[11px]"
				/>
			</div>
		</div>
	);
}

export default MessageComposer;
