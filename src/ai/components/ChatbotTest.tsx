import type { JSX } from "react";
import { PiStopCircle } from "react-icons/pi";
import Markdown from "react-markdown";

import CheckButton from "@/components/Button/CheckButton";
import { Input } from "@/components/Input/Input";

import { useChatbot } from "../hooks/chatbot.hook";

export default function ChatbotTest(): JSX.Element {
	const { answer, error, pending, reasoning, ask, abort } = useChatbot();

	return (
		<>
			<form
				className="flex flex-col gap-1"
				onSubmit={(event) => {
					event.preventDefault();
					const formData = new FormData(event.currentTarget);
					const message = (formData.get("Message") as string).trim();
					if (message.length !== 0) {
						void ask(message);
					}
				}}
			>
				<Input name="Message" placeholder="Chat with Gemma" required>
					{pending && (
						<PiStopCircle
							size={24}
							className="mr-2 cursor-pointer text-muted hover:text-text"
							onClick={() => {
								abort();
							}}
						/>
					)}
				</Input>
				<CheckButton type="submit" pending={pending}>
					Chat
				</CheckButton>
			</form>
			<div className="text-muted">
				<Markdown>{reasoning}</Markdown>
			</div>
			<div className="whitespace-pre-wrap">
				{error === null ? (
					<Markdown>{answer}</Markdown>
				) : (
					<span className="text-error">{error}</span>
				)}
			</div>
		</>
	);
}
