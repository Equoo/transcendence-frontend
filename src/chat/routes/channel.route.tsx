import { data, redirect } from "react-router";

import { APIError } from "@/api/problem_detail";
import { type ChannelBody, createChannel, deleteChannel, updateChannel } from "@/chat/api/chat.api";
import { useChat } from "@/chat/hooks/chat.hook";

import type { Route } from "./+types/channel.route";

function channelBodyFromForm(formData: FormData): ChannelBody {
	const category = formData.get("category") as string | null;

	return {
		name: formData.get("Name") as string,
		topic: formData.get("Topic") as string,
		whitelistRoles: formData.getAll("Roles") as string[],
		categorySync: formData.has("Syncronised"),
		category: category === "" ? null : category,
	};
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({ request }: Route.ClientActionArgs) {
	let res;

	try {
		const formdata = await request.formData();
		const channel = channelBodyFromForm(formdata);
		const id = formdata.get("id") as string | null;

		if (request.method === "DELETE") {
			if (!id) {
				throw new Error("Channel ID is required for deletion");
			}
			await deleteChannel(id);

			useChat.getState().removeChannel(id);
		} else if (request.method === "POST") {
			res = await createChannel(channel);

			res.messages = [];
			useChat.getState().addChannel(res);

			return redirect(`/channels/${res.id}`);
		} else if (request.method === "PUT") {
			if (!id) {
				throw new Error("Channel ID is required for update");
			}
			res = await updateChannel(id, channel);

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
