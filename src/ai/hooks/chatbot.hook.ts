import {
	EventStreamContentType,
	fetchEventSource,
} from "@microsoft/fetch-event-source";
import { create } from "zustand";

class RetryError extends Error {}

interface ChatbotState {
	answer: string;
	reasoning: string;
	pending: boolean;
	error: string | null;
	ask: (message: string) => Promise<void>;
	abort: () => void;
}

export const useChatbot = create<ChatbotState>((set, get) => {
	let abortController = new AbortController();

	return {
		answer: "",
		reasoning: "",
		pending: false,
		error: null,
		ask: async (message): Promise<void> => {
			abortController.abort();
			abortController = new AbortController();
			set({ answer: "", reasoning: "", pending: true, error: null });
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
							set((old) => ({
								answer:
									old.answer +
									(JSON.parse(ev.data) as { text: string })
										.text,
							}));
							break;
						case "reasoning":
							set((old) => ({
								reasoning:
									old.reasoning +
									(JSON.parse(ev.data) as { text: string })
										.text,
							}));
							break;
						case "done":
							set((old) => ({
								answer: `${old.answer}\n**Done !**`,
								pending: false,
							}));
							break;
						case "error":
							set({ error: ev.data });
							break;
					}
				},
				async onopen(res) {
					if (
						res.ok &&
						res.headers.get("content-type") ===
							EventStreamContentType
					) {
						return;
					}
					if (res.headers.get("Token-Expired") === "True") {
						const refresh = await fetch("/api/auth/refresh");

						if (!refresh.ok) {
							throw new Error();
						}
						throw new RetryError();
					}
				},
				onclose() {
					if (get().pending) {
						throw new RetryError();
					}
				},
				onerror(err) {
					if (!(err instanceof RetryError)) {
						throw err;
					}
				},
			});
			set({ pending: false });
		},
		abort: (): void => {
			abortController.abort();
			abortController = new AbortController();
		},
	};
});
