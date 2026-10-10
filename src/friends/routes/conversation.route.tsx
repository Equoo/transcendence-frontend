import { data, redirect } from "react-router";

import { APIError } from "@/api/problem_detail";

import { type ConversationBody, createConv, deleteConv, updateConv } from "../api/conversations.api";
import type { Route } from "./+types/conversation.route";

function conversationBodyFromForm(formData: FormData): ConversationBody {
	return {
		name: formData.get("Name") as string,
		topic: formData.get("Topic") as string,
		recipients: formData.getAll("Members") as string[],
	};
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({ request }: Route.ClientActionArgs) {
	let res;

	try {
		const formdata = await request.formData();
		const conversation = conversationBodyFromForm(formdata);
		const id = formdata.get("id") as string | null;

		if (request.method === "DELETE") {
			if (!id) {
				throw new Error("Conversation ID is required for deletion");
			}
			await deleteConv(id);

			// useChat.getState().removeConversation(id);
		} else if (request.method === "POST") {
			res = await createConv(conversation);

			res.messages = [];
			// useChat.getState().addConversation(res);

			return redirect(`/conversations/${res.id}`);
		} else if (request.method === "PUT") {
			if (!id) {
				throw new Error("Conversation ID is required for update");
			}
			res = await updateConv(id, conversation);

			// useChat.getState().updateConversation(res.id, res);
		}
	} catch (err) {
		if (err instanceof APIError) {
			if (err.problem.status > 400) {
				return data(err);
			}
		}
		throw err;
	}
	return data(res);
}
