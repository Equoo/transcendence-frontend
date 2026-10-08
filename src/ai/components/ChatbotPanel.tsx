import { type JSX, useEffect, useRef, useState } from "react";
import { BsSend } from "react-icons/bs";
import {
	PiArrowsInSimple,
	PiNotePencil,
	PiResize,
	PiSparkle,
	PiStopFill,
	PiX,
} from "react-icons/pi";
import Markdown from "react-markdown";

import IconBtn from "@/components/Button/IconBtn";

import { type ChatbotMessage, useChatbot } from "../hooks/chatbot.hook";

const DEFAULT_SUGGESTIONS = [
	"What's in the knowledge base?",
	"When is the next event?",
	"How do I join a channel?",
];

function TypingDots(): JSX.Element {
	return (
		<span className="inline-flex gap-1 py-1.5" aria-label="Thinking">
			{[0, 150, 300].map((delay) => (
				<span
					key={delay}
					className="size-1.5 rounded-full bg-muted animate-bounce"
					style={{ animationDelay: `${delay}ms` }}
				/>
			))}
		</span>
	);
}

function Bubble({
	message,
	streaming,
}: {
	message: ChatbotMessage;
	streaming: boolean;
}): JSX.Element {
	if (message.role === "user") {
		return (
			<div className="self-end max-w-[85%] rounded-2xl rounded-br-[5px] bg-accent px-3.75 py-3 text-sm leading-[1.55] text-accent-text whitespace-pre-wrap wrap-break-word">
				{message.content}
			</div>
		);
	}

	const empty = message.content === "" && message.error === null;

	return (
		<div className="self-start max-w-[92%] rounded-2xl rounded-bl-[5px] border border-border bg-surface2 px-3.75 py-3 text-sm leading-[1.55] text-text wrap-break-word">
			{message.reasoning !== "" && (
				<details className="group mb-2 text-[12.5px] text-muted">
					<summary className="cursor-pointer select-none font-semibold hover:text-text2">
						{streaming && empty ? "Thinking…" : "Reasoning"}
					</summary>
					<div className="chat-md mt-1.5 border-l-2 border-border2 pl-2.5">
						<Markdown>{message.reasoning}</Markdown>
					</div>
				</details>
			)}
			{empty && streaming && <TypingDots />}
			{message.content !== "" && (
				<div className="chat-md">
					<Markdown>{message.content}</Markdown>
				</div>
			)}
			{message.error !== null && (
				<p className="text-error">{message.error}</p>
			)}
		</div>
	);
}

export default function ChatbotPanel({
	isFull,
	onResize,
	onClose,
	suggestions = DEFAULT_SUGGESTIONS,
	className = "",
}: {
	isFull: boolean;
	onResize: (isFull: boolean) => void;
	onClose: () => void;
	suggestions?: string[];
	className?: string;
}): JSX.Element {
	const { messages, pending, ask, abort, clear } = useChatbot();
	const [text, setText] = useState("");
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const bodyRef = useRef<HTMLDivElement>(null);
	const stickToBottomRef = useRef(true);

	const last = messages.at(-1);

	useEffect(() => {
		if (stickToBottomRef.current) {
			bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
		}
	}, [messages.length, last?.content, last?.reasoning, last?.error]);

	const resize = (): void => {
		const el = inputRef.current;
		if (el) {
			el.style.height = "auto";
			el.style.height = `${el.scrollHeight}px`;
		}
	};

	const send = (message: string): void => {
		const trimmed = message.trim();
		if (trimmed === "" || pending) {
			return;
		}
		setText("");
		stickToBottomRef.current = true;
		requestAnimationFrame(resize);
		void ask(trimmed);
	};

	return (
		<section
			className={`flex flex-col overflow-hidden bg-surface ${className}`}
			aria-label="Assistant"
		>
			<header className="flex flex-none items-center gap-2.5 border-b border-border px-4.5 py-3.75">
				<PiSparkle size={18} className="text-accent" />
				<span className="font-head font-[650]">Keepy</span>
				<div className="ml-auto" />
				{messages.length > 0 && (
					<IconBtn
						discrete
						icon={PiNotePencil}
						size={18}
						aria-label="New conversation"
						title="New conversation"
						onClick={() => {
							clear();
							stickToBottomRef.current = true;
							inputRef.current?.focus();
						}}
						className="p-1.5!"
					/>
				)}
				<IconBtn
					discrete
					icon={isFull ? PiArrowsInSimple : PiResize}
					size={18}
					aria-label="Resize the assistant"
					onClick={() => {
						onResize(!isFull);
					}}
					className="p-1.5! lg:opacity-100 lg:hover:cursor-pointer sm:hover:cursor-pointer sm:opacity-100 opacity-0 hover:cursor-default"
				/>

				<IconBtn
					discrete
					icon={PiX}
					size={18}
					aria-label="Close assistant"
					onClick={onClose}
					className="p-1.5!"
				/>
			</header>

			<div
				ref={bodyRef}
				className="flex-1 overflow-y-auto p-4.5"
				aria-live="polite"
				onScroll={(ev) => {
					const el = ev.currentTarget;
					stickToBottomRef.current =
						el.scrollHeight - el.scrollTop - el.clientHeight < 40;
				}}
			>
				<div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
					{messages.length === 0 ? (
						<>
							<div className="self-start max-w-[92%] rounded-2xl rounded-bl-[5px] border border-border bg-surface2 px-3.75 py-3 text-sm leading-[1.55] text-text">
								Hi, I'm Keepy, the group assistant. I answer
								from your documents in the knowledge base.
							</div>
							<div className="flex flex-wrap gap-2">
								{suggestions.map((suggestion) => (
									<button
										key={suggestion}
										type="button"
										className="cursor-pointer rounded-full border border-accent/40 bg-surface px-3 py-1.5 text-[12.5px] font-semibold text-accent transition-colors duration-140 hover:bg-accent-soft"
										onClick={() => {
											send(suggestion);
										}}
									>
										{suggestion}
									</button>
								))}
							</div>
						</>
					) : (
						messages.map((message, index) => (
							<Bubble
								// eslint-disable-next-line @eslint-react/no-array-index-key -- append-only list
								key={index}
								message={message}
								streaming={pending && message === last}
							/>
						))
					)}
				</div>
			</div>

			<div className="flex-none px-3 pb-3 sm:px-4 sm:pb-4">
				<form
					className="mx-auto flex w-full max-w-4xl items-end gap-1 rounded-xl border border-border bg-surface p-1.5 pl-3.5 shadow-sm transition-colors duration-140 focus-within:border-accent"
					onSubmit={(ev) => {
						ev.preventDefault();
						send(text);
					}}
				>
					<textarea
						ref={inputRef}
						rows={1}
						value={text}
						placeholder="Ask the assistant…"
						aria-label="Message"
						className="max-h-40 flex-1 resize-none border-0 bg-transparent p-0 py-2 text-[14.5px] text-text placeholder:text-muted outline-none focus:ring-0"
						onChange={(ev) => {
							setText(ev.target.value);
							resize();
						}}
						onKeyDown={(ev) => {
							if (
								ev.key === "Enter" &&
								!ev.shiftKey &&
								!ev.nativeEvent.isComposing
							) {
								ev.preventDefault();
								send(text);
							}
						}}
					/>
					{pending ? (
						<IconBtn
							active
							icon={PiStopFill}
							size={16}
							aria-label="Stop"
							onClick={abort}
							className="grid h-9 w-9 flex-none place-items-center rounded-[11px]"
						/>
					) : (
						<IconBtn
							active
							type="submit"
							icon={BsSend}
							size={16}
							aria-label="Send"
							disabled={text.trim() === ""}
							className="grid h-9 w-9 flex-none place-items-center rounded-[11px]"
						/>
					)}
				</form>
			</div>
		</section>
	);
}
