import { createContext, type JSX, type ReactNode, type RefObject, use, useMemo, useState } from "react";

import type { Message } from "../api/chat.api";
import type { ChatComposerHandles } from "./ChatComposer";
import type { MessageListHandles } from "./MessageList";

interface ChatState {
	textEntry: string;
	lastEntry: string;
	mode: "default" | "edit" | "reply";
	targetMsg: Message | null;
	targetEl: HTMLDivElement | null;
}

interface ChatContextInner {
	id: string;
	listRef: RefObject<MessageListHandles | null>;
	composerRef: RefObject<ChatComposerHandles | null>;
	chatsStates: Map<string, ChatState>;
	setChatMode: (
		mode: "default" | "edit" | "reply",
		target: Message | null,
		targetEl?: HTMLDivElement | null,
	) => void;
	getChatMode: () => ["default" | "edit" | "reply", Message | null, HTMLDivElement | null];
	setChatText: (text: string) => void;
	getChatText: () => string;
	setChatLastText: (text: string) => void;
	getChatLastText: () => string;
}

const ChatContext = createContext<ChatContextInner | null>(null);
ChatContext.displayName = "ChatContext";

export function useChatContext(): ChatContextInner {
	const ctx = use(ChatContext);
	if (!ctx) {
		throw new Error("must be used inside ChatProvider");
	}
	return ctx;
}

export function ChatProvider({ children, chatId, listRef, composerRef }: { children: ReactNode, chatId: string, listRef: RefObject<MessageListHandles | null>, composerRef: RefObject<ChatComposerHandles | null> }): JSX.Element {
	const [states, setStates] = useState(
		// eslint-disable-next-line @eslint-react/use-state
		new Map<string, ChatState>(),
	);
	const defaultState: ChatState = {
		textEntry: "",
		lastEntry: "",
		mode: "default",
		targetMsg: null,
		targetEl: null,
	};

	const setChatMode = (
		mode: "default" | "edit" | "reply",
		target: Message | null,
		targetEl: HTMLDivElement | null = null,
	): void => {
		const state = states.get(chatId) ?? defaultState;
		state.mode = mode;
		state.targetMsg = target;
		state.targetEl = targetEl;

		setStates((prevStates) => new Map(prevStates).set(chatId, state));
	};
	const getChatMode = (): ["default" | "edit" | "reply", Message | null, HTMLDivElement | null] => {
		const state = states.get(chatId);
		return state
			? [state.mode, state.targetMsg, state.targetEl]
			: [defaultState.mode, null, null];
	};

	const setChatText = (text: string): void => {
		const state = states.get(chatId) ?? defaultState;
		state.textEntry = text;

		setStates((prevStates) => new Map(prevStates).set(chatId, state));
	};
	const getChatText = (): string =>
		states.get(chatId)?.textEntry ?? defaultState.textEntry;

	const setChatLastText = (text: string): void => {
		const state = states.get(chatId) ?? defaultState;
		state.lastEntry = text;

		setStates((prevStates) => new Map(prevStates).set(chatId, state));
	};
	const getChatLastText = (): string =>
		states.get(chatId)?.lastEntry ?? defaultState.lastEntry;

	const value = useMemo(
		() => ({
			id: chatId,
			listRef,
			composerRef,
			chatsStates: states,
			setChatMode,
			getChatMode,
			setChatText,
			getChatText,
			setChatLastText,
			getChatLastText
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[states, chatId],
	);

	return <ChatContext value={value}>{children}</ChatContext>;
}
