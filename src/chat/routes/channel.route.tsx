import { data, redirect } from "react-router";

import { APIError } from "@/api/problem_detail";
import { createChannel, updateChannel } from "@/chat/api/chat.api";
import { useChat } from "@/chat/hooks/chat.hook";
import { deleteEvent } from "@/events/api/events.api";

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
			res = await deleteEvent(formdata.get("id") as string);
		} else if (request.method === "POST") {
			res = await createChannel(formdata);

			useChat.getState().addChannel(res);

			return redirect(`/channels/${res.id}`);
		} else if (request.method === "PUT") {
			if (!formdata.get("id")) {
				throw new Error("Channel ID is required for update");
			}
			res = await updateChannel(formdata);
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
