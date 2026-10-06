import {
	EventStreamContentType,
	fetchEventSource,
} from "@microsoft/fetch-event-source";
import { create } from "zustand";

class RetryError extends Error {}

export interface ChatbotMessage {
	role: "user" | "assistant";
	content: string;
	reasoning: string;
	error: string | null;
}

interface ChatbotState {
	messages: ChatbotMessage[];
	pending: boolean;
	ask: (message: string) => Promise<void>;
	abort: () => void;
	clear: () => void;
}

function newMessage(
	role: ChatbotMessage["role"],
	content = "",
): ChatbotMessage {
	return { role, content, reasoning: "", error: null };
}

export const useChatbot = create<ChatbotState>((set) => {
	let abortController = new AbortController();

	const patchLast = (
		fn: (msg: ChatbotMessage) => Partial<ChatbotMessage>,
	): void => {
		set((old) => {
			const last = old.messages.at(-1);
			if (last?.role !== "assistant") {
				return old;
			}
			return {
				messages: [
					...old.messages.slice(0, -1),
					{ ...last, ...fn(last) },
				],
			};
		});
	};

	return {
		messages: [],
		pending: false,
		ask: async (message): Promise<void> => {
			abortController.abort();
			abortController = new AbortController();

			let finished = false;
			set((old) => ({
				messages: [
					...old.messages,
					newMessage("user", message),
					newMessage("assistant"),
				],
				pending: true,
			}));

			try {
				await fetchEventSource("/api/ai/chatbot/stream", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ message }),
					openWhenHidden: true,
					signal: abortController.signal,
					onmessage(ev) {
						// eslint-disable-next-line default-case
						switch (ev.event) {
							case "delta":
								patchLast((msg) => ({
									content:
										msg.content +
										(
											JSON.parse(ev.data) as {
												text: string;
											}
										).text,
								}));
								break;
							case "reasoning":
								patchLast((msg) => ({
									reasoning:
										msg.reasoning +
										(
											JSON.parse(ev.data) as {
												text: string;
											}
										).text,
								}));
								break;
							case "done":
								finished = true;
								break;
							case "error":
								finished = true;
								patchLast(() => ({ error: ev.data }));
								break;
						}
					},
					async onopen(res) {
						if (
							res.ok &&
							res.headers.get("content-type") ===
								EventStreamContentType
						) {
							patchLast(() => ({
								content: "",
								reasoning: "",
							}));
							return;
						}
						if (res.headers.get("Token-Expired") === "True") {
							const refresh = await fetch("/api/auth/refresh");

							if (!refresh.ok) {
								throw new Error("Session expired");
							}
							throw new RetryError();
						}
						throw new Error(
							`The assistant is unavailable (${res.status})`,
						);
					},
					onclose() {
						if (!finished) {
							throw new RetryError();
						}
					},
					onerror(err) {
						if (!(err instanceof RetryError)) {
							throw err;
						}
					},
				});
			} catch (err) {
				patchLast(() => ({
					error:
						err instanceof Error && err.message !== ""
							? err.message
							: "Something went wrong",
				}));
			}
			set({ pending: false });
		},
		abort: (): void => {
			abortController.abort();
			abortController = new AbortController();
			set({ pending: false });
		},
		clear: (): void => {
			abortController.abort();
			abortController = new AbortController();
			set({ messages: [], pending: false });
		},
	};
});
