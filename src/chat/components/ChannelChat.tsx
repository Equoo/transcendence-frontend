import {
	createContext,
	type JSX,
	type ReactNode,
	use,
	useMemo,
	useRef,
	useState,
} from "react";

import { useChat } from "@/chat/hooks/chat.hook";
import { useUser } from "@/users/hooks/users.hooks";

import { type Message, sendMessage } from "../api/chat.api";
import ChatComposer from "./ChatComposer";
import MessageList, { type MessageListHandles } from "./MessageList";

interface ChatState {
	textEntry: string;
	mode: "default" | "edit" | "reply";
	targetMsg: Message | null;
}

interface ChatContextInner {
	id: string;
	setId: (id: string) => void;

	chatsStates: Map<string, ChatState>;
	setChatMode: (
		mode: "default" | "edit" | "reply",
		target: Message | null,
	) => void;
	getChatMode: () => ["default" | "edit" | "reply", Message | null];
	setChatText: (text: string) => void;
	getChatText: () => string;
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

function ChatProvider({ children }: { children: ReactNode }): JSX.Element {
	const [states, setStates] = useState(
		// eslint-disable-next-line @eslint-react/use-state
		new Map<string, ChatState>(),
	);
	const [id, setId] = useState("");
	const defaultState: ChatState = {
		textEntry: "",
		mode: "default",
		targetMsg: null,
	};

	const setChatMode = (
		mode: "default" | "edit" | "reply",
		target: Message | null,
	): void => {
		const state = states.get(id) ?? defaultState;
		state.mode = mode;
		state.targetMsg = target;

		setStates((prevStates) => new Map(prevStates).set(id, state));
	};
	const getChatMode = (): ["default" | "edit" | "reply", Message | null] => {
		const state = states.get(id);
		return state
			? [state.mode, state.targetMsg]
			: [defaultState.mode, defaultState.targetMsg];
	};

	const setChatText = (text: string): void => {
		const state = states.get(id) ?? defaultState;
		state.textEntry = text;

		setStates((prevStates) => new Map(prevStates).set(id, state));
	};
	const getChatText = (): string =>
		states.get(id)?.textEntry ?? defaultState.textEntry;

	const value = useMemo(
		() => ({
			id,
			setId,
			chatsStates: states,
			setChatMode,
			getChatMode,
			setChatText,
			getChatText,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[states],
	);

	return <ChatContext value={value}>{children}</ChatContext>;
}

function ChannelChat({ channelId }: { channelId: string }): JSX.Element {
	const channel = useChat((state) => state.channels[channelId]);
	const listRef = useRef<MessageListHandles>(null);

	const addMsg = useChat((state) => state.addMsg);
	const updateMsg = useChat((state) => state.updateMsg);

	const [counter, setCounter] = useState(0);
	const user = useUser();

	const onSend = (text: string): void => {
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

		listRef.current?.scrollBack();
	};

	return (
		<div className="flex min-h-0 flex-1">
			<div className="flex min-w-0 flex-1 flex-col">
				<ChatProvider>
					<MessageList
						ref={listRef}
						key={channel?.id}
						channelId={channel?.id ?? ""}
					/>
					<ChatComposer
						placeholder={`Message to #${channel?.name}...`}
						onSend={onSend}
					/>
				</ChatProvider>
			</div>
		</div>
	);
}

export default ChannelChat;
