import { data, redirect } from "react-router";

import { APIError } from "@/api/problem_detail";
import { createChannel, deleteChannel, updateChannel } from "@/chat/api/chat.api";
import { useChat } from "@/chat/hooks/chat.hook";

import type { Route } from "./+types/channel.route";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({ request }: Route.ClientActionArgs) {
	let res;

	try {
		const formdata = await request.formData();

		if (request.method === "DELETE") {
			if (!formdata.get("id")) {
				throw new Error("Channel ID is required for deletion");
			}
			await deleteChannel(formdata.get("id") as string);

			useChat.getState().removeChannel(formdata.get("id") as string);
		} else if (request.method === "POST") {
			res = await createChannel(formdata);

			res.messages = [];
			useChat.getState().addChannel(res);

			return redirect(`/channels/${res.id}`);
		} else if (request.method === "PUT") {
			if (!formdata.get("id")) {
				throw new Error("Channel ID is required for update");
			}
			res = await updateChannel(formdata);

			useChat.getState().updateChannel(res.id, res);
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
