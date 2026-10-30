import { createContext, type JSX, type ReactNode, type RefObject, use, useMemo, useRef, useState } from "react";

import type { Message } from "../api/chat.api";
import type { ChatComposerHandles } from "./ChatComposer";
import type { MessageListHandles } from "./Messages/MessageList";

export type ChatMode = "default" | "edit" | "reply";

interface ChatState {
	textEntry: string;
	lastEntry: string;
	mode: ChatMode;
	targetMsg: Message | null;
	targetEl: HTMLDivElement | null;
}

interface ChatContextInner {
	id: string;
	listRef: RefObject<MessageListHandles | null>;
	composerRef: RefObject<ChatComposerHandles | null>;
	chatsStates: Map<string, ChatState>;
	scrollRef: RefObject<Map<string, number>>;
	setChatMode: (
		mode: ChatMode,
		target: Message | null,
		targetEl?: HTMLDivElement | null,
	) => void;
	getChatMode: () => [ChatMode, Message | null, HTMLDivElement | null];
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
	const [states, setStates] = useState(() =>
		new Map<string, ChatState>(),
	);
	const scrollRef = useRef<Map<string, number>>(new Map());
	const defaultState: ChatState = {
		textEntry: "",
		lastEntry: "",
		mode: "default",
		targetMsg: null,
		targetEl: null,
	};

	const value = useMemo(() => {
		const update = (patch: Partial<typeof defaultState>): void => {
			setStates((prev) =>
				new Map(prev).set(chatId, {
					...(prev.get(chatId) ?? defaultState),
					...patch,
				}),
			);
		};

		return {
			id: chatId,
			listRef,
			composerRef,
			scrollRef,
			chatsStates: states,

			setChatMode: (
				mode: ChatMode,
				target: Message | null,
				targetEl: HTMLDivElement | null = null,
			): void => {
				update({ mode, targetMsg: target, targetEl });
			},

			getChatMode: (): [ChatMode, Message | null, HTMLDivElement | null] => {
				const state = states.get(chatId);
				return state
					? [state.mode, state.targetMsg, state.targetEl]
					: [defaultState.mode, null, null];
			},

			setChatText: (text: string): void => {
				update({ textEntry: text });
			},

			getChatText: (): string =>
				states.get(chatId)?.textEntry ?? defaultState.textEntry,

			setChatLastText: (text: string): void => {
				update({ lastEntry: text });
			},

			getChatLastText: (): string =>
				states.get(chatId)?.lastEntry ?? defaultState.lastEntry,
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chatId, listRef, composerRef, states]);

	return <ChatContext value={value}>{children}</ChatContext>;
}
